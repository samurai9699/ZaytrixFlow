import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, GoalIcon as PaypalIcon, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PRICING_PLANS = {
  pro: {
    title: "Pro Plan",
    price: { monthly: 8, annual: 100 },
  },
  premium: {
    title: "Premium Plan",
    price: { monthly: 15, annual: 150 },
  },
};

const PaymentForm: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  void clientSecret; // Mark as used since it's needed for Stripe setup
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <motion.button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </span>
        ) : (
          'Complete Purchase'
        )}
      </motion.button>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const billingCycle = searchParams.get('billing') || 'monthly';
  const plan = planId ? PRICING_PLANS[planId as keyof typeof PRICING_PLANS] : null;
  const stripeProduct = planId ? STRIPE_PRODUCTS[planId] : null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !plan || !stripeProduct) {
      return;
    }

    const initializePaymentIntent = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          toast.error('Authentication required. Please log in again.');
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_id: stripeProduct.priceId,
            mode: stripeProduct.mode,
            success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/checkout/cancel`,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }

        setClientSecret(data.clientSecret);
      } catch (error: unknown) {
        console.error('Checkout initialization error:', error);
        const msg = error instanceof Error ? error.message : 'Failed to initialize checkout';
        toast.error(msg);
      }
    };

    initializePaymentIntent();
  }, [user, plan, stripeProduct, navigate]);

  const handlePayPalClick = async () => {
    if (!user) {
      toast.error('Please log in to continue with checkout');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: stripeProduct?.priceId,
          mode: stripeProduct?.mode,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No PayPal checkout URL received');
      }
    } catch (error: unknown) {
      console.error('PayPal checkout error:', error);
      const msg = error instanceof Error ? error.message : 'Failed to start PayPal checkout';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#pricing', { replace: true });
  };

  if (!plan || !stripeProduct) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Pricing
        </button>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="p-8 bg-gray-50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">{plan.title}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ${billingCycle === 'annual' ? plan.price.annual : plan.price.monthly}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Billing Cycle</span>
                  <span className="text-gray-900 dark:text-white font-medium capitalize">
                    {billingCycle}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-medium">Total</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ${billingCycle === 'annual' ? plan.price.annual : plan.price.monthly}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Method
              </h2>

              <div className="space-y-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-lg border ${paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-700'
                    } flex items-center gap-3`}
                >
                  <CreditCard className="text-primary-600 dark:text-primary-400" />
                  <span className="flex-1 text-left">Credit / Debit Card</span>
                  {paymentMethod === 'card' && (
                    <Check className="text-primary-600 dark:text-primary-400" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-lg border ${paymentMethod === 'paypal'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-700'
                    } flex items-center gap-3`}
                >
                  <PaypalIcon className="text-primary-600 dark:text-primary-400" />
                  <span className="flex-1 text-left">PayPal</span>
                  {paymentMethod === 'paypal' && (
                    <Check className="text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              </div>

              {paymentMethod === 'card' ? (
                clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
                  </div>
                )
              ) : (
                <motion.button
                  onClick={handlePayPalClick}
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg bg-[#0070BA] text-white font-medium shadow-lg hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    'Pay with PayPal'
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;