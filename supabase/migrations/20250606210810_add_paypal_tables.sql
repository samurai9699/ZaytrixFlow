-- Create PayPal orders table
CREATE TABLE IF NOT EXISTS paypal_orders (
    id bigint primary key generated always as identity,
    user_id uuid references auth.users(id) not null,
    order_id text not null unique,
    price_id text not null,
    mode text not null check (mode in ('payment', 'subscription')),
    status text not null check (status in ('pending', 'completed', 'cancelled')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE paypal_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PayPal orders"
    ON paypal_orders
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create PayPal subscriptions table
CREATE TABLE IF NOT EXISTS paypal_subscriptions (
    id bigint primary key generated always as identity,
    user_id uuid references auth.users(id) not null,
    subscription_id text not null unique,
    price_id text not null,
    status text not null check (status in ('active', 'cancelled', 'suspended')),
    current_period_start timestamp with time zone default now(),
    current_period_end timestamp with time zone default null,
    cancel_at_period_end boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE paypal_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PayPal subscriptions"
    ON paypal_subscriptions
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create trigger functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for PayPal orders
CREATE TRIGGER update_paypal_orders_updated_at
    BEFORE UPDATE ON paypal_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for PayPal subscriptions
CREATE TRIGGER update_paypal_subscriptions_updated_at
    BEFORE UPDATE ON paypal_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 