import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { getProductByPriceId } from '../../../stripe-config';

interface SubscriptionData {
  priceId: string | null;
  status: string | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  paymentMethodBrand: string | null;
  paymentMethodLast4: string | null;
}

const SubscriptionSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setSubscription({
          priceId: data.price_id,
          status: data.subscription_status,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end,
          paymentMethodBrand: data.payment_method_brand,
          paymentMethodLast4: data.payment_method_last4
        });
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !subscription?.priceId) return;

    try {
      setActionLoading(true);
      
      // In a real implementation, this would call a Supabase Edge Function
      // to cancel the subscription via Stripe API
      toast.error('Subscription cancellation is not implemented in this demo');
      
      // Simulate cancellation for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your subscription has been set to cancel at the end of the current billing period');
      
      // Update local state to reflect cancellation
      setSubscription(prev => prev ? {
        ...prev,
        cancelAtPeriodEnd: true
      } : null);
      
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!user || !subscription?.priceId) return;

    try {
      setActionLoading(true);
      
      // In a real implementation, this would call a Supabase Edge Function
      // to resume the subscription via Stripe API
      toast.error('Subscription resumption is not implemented in this demo');
      
      // Simulate resumption for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your subscription has been resumed');
      
      // Update local state to reflect resumption
      setSubscription(prev => prev ? {
        ...prev,
        cancelAtPeriodEnd: false
      } : null);
      
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast.error('Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProductDetails = () => {
    if (!subscription?.priceId) return null;
    return getProductByPriceId(subscription.priceId);
  };

  const productDetails = getProductDetails();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Management
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your subscription plan and billing details
        </p>
      </div>

      {subscription && subscription.priceId && subscription.status === 'active' ? (
        <div className="space-y-8">
          {/* Current Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Plan</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400">
                Active
              </span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                <CheckCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {productDetails?.name || 'Premium'} Plan
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {productDetails?.description || 'Advanced features for growing businesses'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Period</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {subscription.currentPeriodEnd ? 'Monthly' : 'Annual'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  {subscription.paymentMethodBrand && subscription.paymentMethodLast4 && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {subscription.paymentMethodBrand} •••• {subscription.paymentMethodLast4}
                      </p>
                    </div>
                  )}
                </div>
                
                {subscription.cancelAtPeriodEnd ? (
                  <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-warning-800 dark:text-warning-200 mb-1">
                          Your subscription is set to cancel
                        </h4>
                        <p className="text-sm text-warning-700 dark:text-warning-300">
                          Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. 
                          You'll lose access to premium features after this date.
                        </p>
                        <button
                          onClick={handleResumeSubscription}
                          disabled={actionLoading}
                          className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                        >
                          {actionLoading ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Resume Subscription
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={actionLoading}
                    className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 font-medium text-sm flex items-center gap-1"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Plans</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(STRIPE_PRODUCTS).map(([id, product]) => (
                <div
                  key={id}
                  className={`p-6 rounded-xl border ${
                    (product.monthlyPriceId === subscription.priceId || product.annualPriceId === subscription.priceId)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name} Plan
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.monthlyPrice}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                  </div>

                  {(product.monthlyPriceId === subscription.priceId || product.annualPriceId === subscription.priceId) ? (
                    <div className="flex items-center text-success-600 dark:text-success-400 font-medium">
                      <CheckCircle size={16} className="mr-2" />
                      Current Plan
                    </div>
                  ) : (
                    <Link
                      to={`/checkout/${id}`}
                      className="block w-full text-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      Upgrade
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/30 inline-flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Active Subscription
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            You're currently on the Free plan. Upgrade to access premium features and get the most out of ZaytrixFlow.
          </p>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {Object.entries(STRIPE_PRODUCTS).map(([id, product]) => (
              <div 
                key={id}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name} Plan
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {product.description}
                </p>
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${product.monthlyPrice}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                </div>

                <Link
                  to={`/checkout/${id}`}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings;
