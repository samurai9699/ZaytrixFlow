-- Migration: 20260415090400_stripe_webhooks_v2.sql

CREATE TYPE stripe_event_status AS ENUM ('processing', 'processed', 'failed');

CREATE TABLE IF NOT EXISTS stripe_events (
    id VARCHAR(255) PRIMARY KEY, -- Enforces idempotency via UNIQUE constraint natively
    type VARCHAR(255) NOT NULL,
    status stripe_event_status NOT NULL DEFAULT 'processing',
    payload JSONB NOT NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON stripe_events(status) WHERE status = 'failed';

-- Helper to safely handle webhook events within a Postgres transaction that captures failures
CREATE OR REPLACE FUNCTION process_stripe_webhook_v2(
    p_event_id VARCHAR(255),
    p_event_type VARCHAR(255),
    p_payload JSONB,
    p_action VARCHAR(50),
    p_action_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_status stripe_event_status;
BEGIN
    -- 1. Idempotency Check
    BEGIN
        INSERT INTO stripe_events (id, type, status, payload)
        VALUES (p_event_id, p_event_type, 'processing', p_payload);
    EXCEPTION WHEN unique_violation THEN
        -- If already exists, determine if it safely completed, is locked, or needs retry
        SELECT status INTO v_status FROM stripe_events WHERE id = p_event_id FOR UPDATE NOWAIT;
        
        IF v_status = 'processed' THEN
            RETURN jsonb_build_object('success', true, 'message', 'Skipped: event already processed', 'skipped', true);
        ELSIF v_status = 'processing' THEN
            RETURN jsonb_build_object('success', false, 'message', 'Event currently processing', 'skipped', true);
        END IF;

        -- If 'failed', we are retrying. Set back to processing.
        UPDATE stripe_events SET status = 'processing', error_message = NULL, updated_at = NOW() WHERE id = p_event_id;
    END;

    -- 2. Business Logic Execution
    -- This SUB-BLOCK is completely transaction-safe. If it errors, only this block rolls back.
    BEGIN
        IF p_action = 'sync_subscription' THEN
            INSERT INTO stripe_subscriptions (
                customer_id, 
                subscription_id, 
                price_id, 
                current_period_start, 
                current_period_end, 
                cancel_at_period_end,
                payment_method_brand, 
                payment_method_last4, 
                status
            ) VALUES (
                p_action_data->>'customer_id',
                p_action_data->>'subscription_id',
                p_action_data->>'price_id',
                (p_action_data->>'current_period_start')::bigint,
                (p_action_data->>'current_period_end')::bigint,
                (p_action_data->>'cancel_at_period_end')::boolean,
                p_action_data->>'payment_method_brand',
                p_action_data->>'payment_method_last4',
                p_action_data->>'status'
            )
            ON CONFLICT (customer_id) DO UPDATE SET
                subscription_id = EXCLUDED.subscription_id,
                price_id = EXCLUDED.price_id,
                current_period_start = EXCLUDED.current_period_start,
                current_period_end = EXCLUDED.current_period_end,
                cancel_at_period_end = EXCLUDED.cancel_at_period_end,
                payment_method_brand = COALESCE(EXCLUDED.payment_method_brand, stripe_subscriptions.payment_method_brand),
                payment_method_last4 = COALESCE(EXCLUDED.payment_method_last4, stripe_subscriptions.payment_method_last4),
                status = EXCLUDED.status;

        ELSIF p_action = 'insert_order' THEN
            INSERT INTO stripe_orders (
                checkout_session_id, 
                payment_intent_id, 
                customer_id, 
                amount_subtotal, 
                amount_total, 
                currency, 
                payment_status, 
                status
            ) VALUES (
                p_action_data->>'checkout_session_id',
                p_action_data->>'payment_intent_id',
                p_action_data->>'customer_id',
                (p_action_data->>'amount_subtotal')::integer,
                (p_action_data->>'amount_total')::integer,
                p_action_data->>'currency',
                p_action_data->>'payment_status',
                p_action_data->>'status'
            );
        END IF;

        -- 3. Mark as successfully processed
        UPDATE stripe_events SET status = 'processed', updated_at = NOW() WHERE id = p_event_id;

        RETURN jsonb_build_object('success', true, 'message', 'Event processed successfully', 'skipped', false);

    EXCEPTION WHEN OTHERS THEN
        -- If any error occurs inside the business logic block, the database automatically
        -- rolls back any partial inserts/updates. We catch the error here to write to DLQ.
        
        UPDATE stripe_events 
        SET status = 'failed', 
            error_message = SQLERRM, 
            updated_at = NOW() 
        WHERE id = p_event_id;

        RETURN jsonb_build_object('success', false, 'message', SQLERRM, 'skipped', false);
    END;
END;
$$ LANGUAGE plpgsql;
