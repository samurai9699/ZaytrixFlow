import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const PRICING_PLANS = {
  pro: {
    title: "Pro Plan",
    price: { monthly: 8, annual: 100 },
    stripeMonthlyPriceId: 'price_1RX7OODnl7eA7o2ILPyqAk3r',
    stripeAnnualPriceId: 'price_1RX7TcDnl7eA7o2IAROVqhIK',
    features: ['Advanced features', 'Priority support', '10GB storage']
  },
  premium: {
    title: "Premium Plan",
    price: { monthly: 15, annual: 150 },
    stripeMonthlyPriceId: 'price_1RX7RLDnl7eA7o2ImjEdcoOa',
    stripeAnnualPriceId: 'price_1RX7SPDnl7eA7o2IuZTSsS3Y',
    features: ['All Pro features', '24/7 support', 'Unlimited storage', 'Custom integrations']
  },
};

interface CheckoutState {
  status: 'loading' | 'processing' | 'error' | 'redirecting';
  message: string;
}

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    status: 'loading',
    message: 'Initializing checkout...'
  });

  const billingCycle = searchParams.get('billing') || 'monthly';
  const plan = planId ? PRICING_PLANS[planId as keyof typeof PRICING_PLANS] : null;

  // Calculate savings for annual billing
  const calculateSavings = () => {
    if (!plan || billingCycle !== 'annual') return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const annualPrice = plan.price.annual;
    return monthlyTotal - annualPrice;
  };

  useEffect(() => {
    const initializeCheckout = async () => {
      // Validate plan exists
      if (!plan) {
        setCheckoutState({
          status: 'error',
          message: 'Invalid plan selected'
        });
        setTimeout(() => navigate('/pricing'), 2000);
        return;
      }

      // Check authentication
      if (!user) {
        const loginRedirectUrl = `/login?redirect=/checkout/${planId}${billingCycle === 'annual' ? '?billing=annual' : ''}`;
        toast.error('Please log in or create an account to continue');
        navigate(loginRedirectUrl);
        return;
      }

      setCheckoutState({
        status: 'processing',
        message: 'Creating your checkout session...'
      });

      try {
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Select the correct price ID based on billing cycle
        const priceId = billingCycle === 'annual' 
          ? plan.stripeAnnualPriceId 
          : plan.stripeMonthlyPriceId;

        // Get the user's session for authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('Authentication required. Please log in again.');
        }

        setCheckoutState({
          status: 'processing',
          message: 'Redirecting to secure payment...'
        });

        // Create a Stripe Checkout Session using our Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_id: priceId,
            success_url: `${window.location.origin}/`,
            cancel_url: `${window.location.origin}/pricing`,
            mode: 'subscription',
            // Add metadata for tracking
            metadata: {
              user_id: user.id,
              plan_id: planId,
              billing_cycle: billingCycle
            }
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create checkout session');
        }

        const { url } = await response.json();
        
        setCheckoutState({
          status: 'redirecting',
          message: 'Redirecting to payment...'
        });

        // Redirect to Stripe Checkout
        window.location.href = url;

      } catch (error: any) {
        console.error('Checkout error:', error);
        setCheckoutState({
          status: 'error',
          message: error.message || 'Failed to start checkout process'
        });
        toast.error(error.message || 'Failed to start checkout process');
        
        // Redirect back to pricing after error
        setTimeout(() => navigate('/pricing'), 3000);
      }
    };

    initializeCheckout();
  }, [user, plan, billingCycle, navigate, planId]);

  // Handle back navigation
  const handleGoBack = () => {
    navigate('/pricing');
  };

  if (!plan) {
    return null;
  }

  const savings = calculateSavings();
  const displayPrice = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleGoBack}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              disabled={checkoutState.status === 'processing' || checkoutState.status === 'redirecting'}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <CreditCard className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <div className="w-5" /> {/* Spacer for centering */}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            You're upgrading to {plan.title}
          </p>
        </div>

        {/* Plan Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {plan.title}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${displayPrice}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>
              {billingCycle === 'annual' && savings > 0 && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  Save ${savings}/year
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="mb-4">
            {checkoutState.status === 'error' ? (
              <div className="text-red-500 dark:text-red-400">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-2">
                  ❌
                </div>
              </div>
            ) : (
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            )}
          </div>

          <h2 className={`text-lg font-semibold mb-2 ${
            checkoutState.status === 'error' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {checkoutState.status === 'error' ? 'Something went wrong' : 'Processing...'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {checkoutState.message}
          </p>

          {checkoutState.status === 'error' && (
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Return to Pricing
            </button>
          )}
        </div>

        {/* Security Note */}
        {checkoutState.status === 'processing' && (
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
              🔒 Your payment is secured by Stripe. We never store your payment information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;