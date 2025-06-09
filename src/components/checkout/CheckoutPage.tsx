import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, GoalIcon as PaypalIcon, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const billingCycle = searchParams.get('billing') || 'monthly';
  const stripeProduct = planId ? STRIPE_PRODUCTS[planId as keyof typeof STRIPE_PRODUCTS] : null;

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  useEffect(() => {
    // Redirect if no valid plan is selected
    if (!stripeProduct) {
      toast.error('Invalid plan selected');
      navigate('/#pricing');
    }
  }, [stripeProduct, navigate]);

  if (!stripeProduct) {
    return null;
  }

  const price = billingCycle === 'annual' 
    ? Math.round(stripeProduct.price * 12 * 0.8) 
    : stripeProduct.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      toast.error('PayPal integration is not available yet');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to connect to PayPal. Please try again.');
      setLoading(false);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#pricing', { replace: true });
  };

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
                  <span className="text-gray-600 dark:text-gray-300">{stripeProduct.name} Plan</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ${price}
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
                      ${price}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                <h3 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
                  {stripeProduct.name} Plan Includes:
                </h3>
                <ul className="space-y-2">
                  {stripeProduct.name === 'Pro' ? (
                    <>
                      <li className="flex items-start">
                        <Check size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">Up to 20 clients</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">10 invoice templates</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">Advanced reminder schedule</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <Check size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">Unlimited clients</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">Custom invoice templates</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">AI-powered reminder optimization</span>
                      </li>
                    </>
                  )}
                </ul>
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
                  className={`w-full p-4 rounded-lg border ${
                    paymentMethod === 'card'
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
                  className={`w-full p-4 rounded-lg border ${
                    paymentMethod === 'paypal'
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
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
                      'Proceed to Checkout'
                    )}
                  </motion.button>
                </form>
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

              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                By proceeding, you agree to our <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className=\"text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</Link>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;