import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const PRICING_PLANS = {
  pro: {
    title: "Pro Plan",
    price: { monthly: 8, annual: 100 },
    stripeMonthlyPriceId: 'price_1RX7OODnl7eA7o2ILPyqAk3r', // Replace with your Stripe price ID
    stripeAnnualPriceId: 'price_1RX7OODnl7eA7o2ILPyqAk3s'  // Replace with your Stripe price ID
  },
  premium: {
    title: "Premium Plan",
    price: { monthly: 15, annual: 150 },
    stripeMonthlyPriceId: 'price_1RX7RLDnl7eA7o2ImjEdcoOa', // Replace with your Stripe price ID
    stripeAnnualPriceId: 'price_1RX7RLDnl7eA7o2ImjEdcoOb'  // Replace with your Stripe price ID
  },
};

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const billingCycle = searchParams.get('billing') || 'monthly';
  const plan = planId ? PRICING_PLANS[planId as keyof typeof PRICING_PLANS] : null;

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!plan) {
        navigate('/');
        return;
      }

      if (!user) {
        // Store checkout parameters in the URL when redirecting to login
        const loginRedirectUrl = `/login?redirect=/checkout/${planId}${billingCycle === 'annual' ? '?billing=annual' : ''}`;
        toast.error('Please log in or create an account to start your free trial');
        navigate(loginRedirectUrl);
        return;
      }

      try {
        // Select the correct price ID based on billing cycle
        const priceId = billingCycle === 'annual' 
          ? plan.stripeAnnualPriceId 
          : plan.stripeMonthlyPriceId;

        // Get the user's session for authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        // Create a Stripe Checkout Session using our Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_id: priceId,
            success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/`,
            mode: 'subscription'
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create checkout session');
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (error: any) {
        console.error('Checkout error:', error);
        toast.error(error.message || 'Failed to start checkout process');
        navigate('/');
      }
    };

    initializeCheckout();
  }, [user, plan, billingCycle, navigate, planId]);

  if (!plan) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Preparing Your Checkout...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we set up your {billingCycle} subscription.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;