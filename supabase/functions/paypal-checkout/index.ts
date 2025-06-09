/// <reference lib="deno.ns" />
// @deno-types="https://raw.githubusercontent.com/denoland/deno/main/cli/dts/lib.deno.ns.d.ts"
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { serve, createClient } from "../deps.ts";

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
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

interface PayPalLink {
    rel: string;
    href: string;
}

Deno.serve(async (req) => {
    try {
        if (req.method === 'OPTIONS') {
            return corsResponse({}, 204);
        }

        if (req.method !== 'POST') {
            return corsResponse({ error: 'Method not allowed' }, 405);
        }

        const { price_id, success_url, cancel_url, mode } = await req.json();

        const error = validateParameters(
            { price_id, success_url, cancel_url, mode },
            {
                cancel_url: 'string',
                price_id: 'string',
                success_url: 'string',
                mode: { values: ['payment', 'subscription'] },
            },
        );

        if (error) {
            return corsResponse({ error }, 400);
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

        // Get PayPal access token
        const accessToken = await getPayPalAccessToken();

        // Create PayPal order
        const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: '10.00', // TODO: Get actual price from price_id
                        },
                    },
                ],
                application_context: {
                    return_url: success_url,
                    cancel_url: cancel_url,
                },
            }),
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
            console.error('PayPal order creation failed:', orderData);
            return corsResponse({ error: 'Failed to create PayPal order' }, 500);
        }

        // Store the order details in the database
        const { error: createOrderError } = await supabase.from('paypal_orders').insert({
            user_id: user.id,
            order_id: orderData.id,
            status: orderData.status,
            mode,
            price_id,
        });

        if (createOrderError) {
            console.error('Failed to store PayPal order:', createOrderError);
            return corsResponse({ error: 'Failed to store order details' }, 500);
        }

        // Return the PayPal approval URL
        const approvalUrl = orderData.links.find((link: PayPalLink) => link.rel === 'approve')?.href;
        if (!approvalUrl) {
            return corsResponse({ error: 'No approval URL found in PayPal response' }, 500);
        }

        return corsResponse({ url: approvalUrl });
    } catch (error: unknown) {
        console.error('PayPal checkout error:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return corsResponse({ error: message }, 500);
    }
});

type ExpectedType = 'string' | { values: string[] };

interface ValidationSchema {
    [key: string]: ExpectedType;
}

function validateParameters(
    params: Record<string, unknown>,
    schema: ValidationSchema,
): string | null {
    for (const [key, expectedType] of Object.entries(schema)) {
        const value = params[key];

        if (value === undefined || value === null) {
            return `Missing required parameter: ${key}`;
        }

        if (typeof expectedType === 'string') {
            if (typeof value !== expectedType) {
                return `Invalid type for ${key}: expected ${expectedType}, got ${typeof value}`;
            }
        } else if ('values' in expectedType) {
            if (!expectedType.values.includes(value as string)) {
                return `Invalid value for ${key}: expected one of [${expectedType.values.join(
                    ', ',
                )}], got ${value}`;
            }
        }
    }

    return null;
} 