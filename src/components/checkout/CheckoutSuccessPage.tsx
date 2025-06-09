import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Simulate verification process
      const timer = setTimeout(() => {
        setLoading(false);
        toast.success('Payment successful! Welcome to ZaytrixFlow!');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Processing your payment...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-error-100 dark:bg-error-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <svg className="w-8 h-8 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Return Home
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-success-100 dark:bg-success-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          Thank you for subscribing to ZaytrixFlow! Your account has been activated and you can now start managing your invoices and payments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Link
            to="/dashboard"
            className="block w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="block w-full px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Return Home
          </Link>
        </motion.div>

        {sessionId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-gray-500 dark:text-gray-400 mt-6"
          >
            Session ID: {sessionId}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutSuccessPage;