import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'ZaytrixFlow',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const USE_V2_WEBHOOKS = Deno.env.get('USE_V2_WEBHOOKS') === 'true';

  if (USE_V2_WEBHOOKS) {
    console.info(`[V2 Webhooks] Processing event: ${event.id} (${event.type})`);
    await handleEventV2(event);
    return;
  }

  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  // for one time payments, we only listen for the checkout.session.completed event
  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === 'subscription';

      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        // Extract the necessary information from the session
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
        } = stripeData as Stripe.Checkout.Session;

        // Insert the order into the stripe_orders table
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed', // assuming we want to mark it as completed since payment is successful
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }
        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    // TODO verify if needed
    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];

    // store subscription state
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}

// ============================================
// V2 WEBHOOK IMPLEMENTATION (RPC DRIVEN)
// ============================================

async function handleEventV2(event: Stripe.Event) {
  const stripeData = event?.data?.object as any;
  if (!stripeData || !('customer' in stripeData)) {
    return;
  }

  const customerId = stripeData.customer;
  if (!customerId || typeof customerId !== 'string') {
    console.error(`[V2] No valid customer received on event: ${event.id}`);
    return;
  }

  let action = 'ignore';
  let actionData: any = {};

  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
      // Ignored in V1
      action = 'ignore';
  } else {
    let isSubscription = true;
    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;
      isSubscription = mode === 'subscription';
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`[V2] Fetching subscription data for customer: ${customerId}`);
      const subData = await getSubscriptionDataForV2(customerId);
      if (subData) {
         action = 'sync_subscription';
         actionData = subData;
      }
    } else if (mode === 'payment' && payment_status === 'paid') {
      const checkoutSession = stripeData as Stripe.Checkout.Session;
      action = 'insert_order';
      actionData = {
        checkout_session_id: checkoutSession.id,
        payment_intent_id: checkoutSession.payment_intent,
        customer_id: customerId,
        amount_subtotal: checkoutSession.amount_subtotal,
        amount_total: checkoutSession.amount_total,
        currency: checkoutSession.currency,
        payment_status: checkoutSession.payment_status,
        status: 'completed',
      };
    }
  }

  // Execute the RPC for safe transaction and idempotency logging
  const { data, error } = await supabase.rpc('process_stripe_webhook_v2', {
    p_event_id: event.id,
    p_event_type: event.type,
    p_payload: event,
    p_action: action,
    p_action_data: actionData
  });

  if (error) {
    console.error(`[V2] RPC Database error processing event ${event.id}:`, error);
    throw new Error(`RPC Database Error: ${error.message}`);
  }

  // data will contain { success: boolean, message: string, skipped: boolean }
  const result = data as any;
  if (result.skipped) {
    console.warn(`[V2] Skipped processing event ${event.id}: ${result.message}`);
  } else if (!result.success) {
    console.error(`[V2] Processing failed for event ${event.id}: ${result.message}`);
    throw new Error(`V2 Processing Error: ${result.message}`);
  } else {
    console.info(`[V2] Successfully processed event ${event.id}: ${result.message}`);
  }
}

async function getSubscriptionDataForV2(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  if (subscriptions.data.length === 0) {
    console.info(`[V2] No active subscriptions found for customer: ${customerId}`);
    // Return minimal payload so RPC updates/inserts as not_started
    return {
      customer_id: customerId,
      subscription_status: 'not_started'
    };
  }

  const subscription = subscriptions.data[0];
  const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod | null;
  
  return {
    customer_id: customerId,
    subscription_id: subscription.id,
    price_id: subscription.items.data[0].price.id,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    payment_method_brand: paymentMethod?.card?.brand ?? null,
    payment_method_last4: paymentMethod?.card?.last4 ?? null,
    status: subscription.status,
  };
}
