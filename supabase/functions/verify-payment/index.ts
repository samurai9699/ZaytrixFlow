import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
    appInfo: {
        name: 'Bolt Integration',
        version: '1.0.0',
    },
});

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')!;
const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')!;
const paypalApiUrl = Deno.env.get('PAYPAL_API_URL') ?? 'https://api-m.sandbox.paypal.com';

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    };

    // For 204 No Content, don't include Content-Type or body
    if (status === 204) {
        return new Response(null, { status, headers });
    }

    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
    });
}

async function getPayPalAccessToken(): Promise<string> {
    const auth = btoa(`${paypalClientId}:${paypalClientSecret}`);
    const response = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`,
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to get PayPal access token');
    }

    return data.access_token;
}

async function verifyStripePayment(sessionId: string, userId: string): Promise<void> {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
        throw new Error('Checkout session not found');
    }

    if (session.payment_status !== 'paid') {
        throw new Error('Payment not completed');
    }

    // Get the customer ID from the session
    const customerId = session.customer as string;
    if (!customerId) {
        throw new Error('No customer found for session');
    }

    // Verify the customer belongs to this user
    const { data: customerData, error: customerError } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', userId)
        .eq('customer_id', customerId)
        .single();

    if (customerError || !customerData) {
        throw new Error('Customer verification failed');
    }

    // Update subscription status if this was a subscription payment
    if (session.mode === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const { error: updateError } = await supabase.from('stripe_subscriptions').upsert({
            customer_id: customerId,
            subscription_id: subscription.id,
            price_id: subscription.items.data[0].price.id,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            status: subscription.status,
        });

        if (updateError) {
            throw new Error('Failed to update subscription status');
        }
    }
}

async function verifyPayPalPayment(orderId: string, userId: string): Promise<void> {
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Verify the order exists and belongs to this user
    const { data: orderData, error: orderError } = await supabase
        .from('paypal_orders')
        .select('*')
        .eq('user_id', userId)
        .eq('order_id', orderId)
        .single();

    if (orderError || !orderData) {
        throw new Error('Order verification failed');
    }

    // Get order details from PayPal
    const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const paypalOrder = await orderResponse.json();

    if (!orderResponse.ok) {
        throw new Error('Failed to verify PayPal order');
    }

    if (paypalOrder.status !== 'COMPLETED') {
        // Capture the payment if not already captured
        const captureResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const captureData = await captureResponse.json();

        if (!captureResponse.ok || captureData.status !== 'COMPLETED') {
            throw new Error('Failed to capture PayPal payment');
        }
    }

    // Update order status in database
    const { error: updateError } = await supabase
        .from('paypal_orders')
        .update({ status: 'completed' })
        .eq('order_id', orderId);

    if (updateError) {
        throw new Error('Failed to update order status');
    }

    // If this was a subscription payment, update subscription status
    if (orderData.mode === 'subscription') {
        const { error: subscriptionError } = await supabase.from('paypal_subscriptions').insert({
            user_id: userId,
            subscription_id: orderId,
            status: 'active',
            price_id: orderData.price_id,
        });

        if (subscriptionError) {
            throw new Error('Failed to create subscription record');
        }
    }
}

Deno.serve(async (req) => {
    try {
        if (req.method === 'OPTIONS') {
            return corsResponse({}, 204);
        }

        if (req.method !== 'POST') {
            return corsResponse({ error: 'Method not allowed' }, 405);
        }

        const { session_id, order_id, type } = await req.json();

        if (!type || (type !== 'stripe' && type !== 'paypal')) {
            return corsResponse({ error: 'Invalid payment type' }, 400);
        }

        if (type === 'stripe' && !session_id) {
            return corsResponse({ error: 'Missing session_id for Stripe payment' }, 400);
        }

        if (type === 'paypal' && !order_id) {
            return corsResponse({ error: 'Missing order_id for PayPal payment' }, 400);
        }

        const authHeader = req.headers.get('Authorization')!;
        const token = authHeader.replace('Bearer ', '');
        const {
            data: { user },
            error: getUserError,
        } = await supabase.auth.getUser(token);

        if (getUserError) {
            return corsResponse({ error: 'Failed to authenticate user' }, 401);
        }

        if (!user) {
            return corsResponse({ error: 'User not found' }, 404);
        }

        if (type === 'stripe') {
            await verifyStripePayment(session_id!, user.id);
        } else {
            await verifyPayPalPayment(order_id!, user.id);
        }

        return corsResponse({ success: true });
    } catch (error: unknown) {
        console.error('Payment verification error:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return corsResponse({ error: message }, 500);
    }
}); 