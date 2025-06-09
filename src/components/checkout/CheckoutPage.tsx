import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// PayPal icon component (since GoalIcon might not be the right icon)
const PaypalIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.355-1.504c-.87-1.567-2.97-2.163-5.682-2.163H9.677L8.455 13.96h2.19c4.298 0 7.665-1.747 8.647-6.797.03-.149.054-.294.077-.437.845-4.314-.478-6.809-2.147-8.809z"/>
  </svg>
);

// Local pricing configuration to avoid import issues
const PRICING_PLANS = {
  pro: {
    title: "Pro Plan",
    price: { monthly: 8, annual: 96 }, // 20% discount for annual
    priceId: {
      monthly: 'price_pro_monthly',
      annual: 'price_pro_annual'
    },
    mode: 'subscription'
  },
  premium: {
    title: "Premium Plan", 
    price: { monthly: 15, annual: 144 }, // 20% discount for annual
    priceId: {
      monthly: 'price_premium_monthly',
      annual: 'price_premium_annual'
    },
    mode: 'subscription'
  },
} as const;

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const billingCycle = (searchParams.get('billing') || 'monthly') as 'monthly' | 'annual';
  const plan = planId ? PRICING_PLANS[planId as keyof typeof PRICING_PLANS] : null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  // Redirect if invalid plan or user not authenticated
  React.useEffect(() => {
    if (!plan) {
      toast.error('Invalid plan selected');
      navigate('/');
      return;
    }
    
    if (!user) {
      toast.error('Please log in to continue with checkout');
      navigate('/auth/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
  }, [plan, user, navigate]);

  // Early return if plan is invalid
  if (!plan) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to continue with checkout');
      navigate('/auth/login');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Authentication required. Please log in again.');
        navigate('/auth/login');
        return;
      }

      // Get the appropriate price ID based on billing cycle
      const priceId = plan.priceId[billingCycle];

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: plan.mode,
          success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalClick = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd create a PayPal payment session
      // For demo purposes, we'll just show a message
      toast.info('PayPal integration would be implemented here');
      
      // Simulate PayPal redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Redirecting to PayPal...');
      
      // For demo, redirect to success page after delay
      setTimeout(() => {
        navigate('/checkout/success');
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to connect to PayPal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#pricing', { replace: true });
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
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
                    ${plan.price[billingCycle]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Billing Cycle</span>
                  <span className="text-gray-900 dark:text-white font-medium capitalize">
                    {billingCycle}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                    <span className="text-sm">Annual Discount (20%)</span>
                    <span className="text-sm font-medium">
                      -${plan.price.monthly * 12 - plan.price.annual}
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-medium">Total</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${plan.price[billingCycle]}
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
                  className={`w-full p-4 rounded-lg border transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  } flex items-center gap-3`}
                >
                  <CreditCard className="text-blue-600 dark:text-blue-400" />
                  <span className="flex-1 text-left text-gray-900 dark:text-white">Credit / Debit Card</span>
                  {paymentMethod === 'card' && (
                    <Check className="text-blue-600 dark:text-blue-400" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-lg border transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  } flex items-center gap-3`}
                >
                  <PaypalIcon />
                  <span className="flex-1 text-left text-gray-900 dark:text-white">PayPal</span>
                  {paymentMethod === 'paypal' && (
                    <Check className="text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ 
                        ...cardDetails, 
                        number: formatCardNumber(e.target.value)
                      })}
                      maxLength={19}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ 
                          ...cardDetails, 
                          expiry: formatExpiry(e.target.value)
                        })}
                        maxLength={5}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ 
                          ...cardDetails, 
                          cvc: e.target.value.replace(/\D/g, '').substring(0, 4)
                        })}
                        maxLength={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              ) : (
                <motion.button
                  onClick={handlePayPalClick}
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg bg-[#0070BA] text-white font-medium shadow-lg hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;