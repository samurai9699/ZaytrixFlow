import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'ZaytrixFlow Retry Worker',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Basic auth check if invoking externally, but Supabase scheduled functions include auth headers implicitly
    console.info(`[Retry Worker] Starting DLQ processing...`);

    // Fetch up to 50 failed events
    const { data: failedEvents, error: fetchError } = await supabase
      .from('stripe_events')
      .select('*')
      .eq('status', 'failed')
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch DLQ: ${fetchError.message}`);
    }

    if (!failedEvents || failedEvents.length === 0) {
      console.info(`[Retry Worker] No failed events found. Everything is healthy.`);
      return Response.json({ processed: 0 });
    }

    console.info(`[Retry Worker] Found ${failedEvents.length} failed events to retry.`);

    let successCount = 0;
    let failureCount = 0;

    for (const eventRow of failedEvents) {
      const event = eventRow.payload as Stripe.Event;
      console.info(`[Retry Worker] Retrying event ${event.id}...`);

      try {
        await retryEventV2(event);
        successCount++;
      } catch (err: any) {
        console.error(`[Retry Worker] Retry failed for event ${event.id}:`, err);
        failureCount++;
      }
    }

    return Response.json({ 
      processed: failedEvents.length,
      successCount,
      failureCount
    });

  } catch (error: any) {
    console.error('[Retry Worker] Fatal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Duplicated core logic for routing into the RPC from stripe-webhook
async function retryEventV2(event: Stripe.Event) {
  const stripeData = event?.data?.object as any;
  if (!stripeData || !('customer' in stripeData)) {
    return;
  }

  const customerId = stripeData.customer;
  let action = 'ignore';
  let actionData: any = {};

  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
      action = 'ignore';
  } else {
    let isSubscription = true;
    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;
      isSubscription = mode === 'subscription';
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
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

  const { data, error } = await supabase.rpc('process_stripe_webhook_v2', {
    p_event_id: event.id,
    p_event_type: event.type,
    p_payload: event,
    p_action: action,
    p_action_data: actionData
  });

  if (error) {
    throw new Error(`RPC Database Error: ${error.message}`);
  }

  const result = data as any;
  if (!result.success && !result.skipped) {
    throw new Error(`V2 Processing Error: ${result.message}`);
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
    return { customer_id: customerId, subscription_status: 'not_started' };
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
