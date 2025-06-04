import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, PaypalIcon, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

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

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const billingCycle = searchParams.get('billing') || 'monthly';
  const plan = planId ? PRICING_PLANS[planId as keyof typeof PRICING_PLANS] : null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Payment successful! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handlePayPalClick = async () => {
    setLoading(true);
    // Simulate PayPal redirect
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.href = 'https://www.paypal.com';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/pricing')}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
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
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
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
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <motion.span
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
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
                  className="w-full py-3 px-6 rounded-lg bg-[#0070BA] text-white font-medium shadow-lg hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <motion.span
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
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