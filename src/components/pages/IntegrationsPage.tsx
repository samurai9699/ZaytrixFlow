import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const INTEGRATIONS = [
  {
    id: 'quickbooks',
    name: "QuickBooks",
    description: "Sync your invoices and payments with QuickBooks for seamless accounting.",
    image: "https://images.pexels.com/photos/6446685/pexels-photo-6446685.jpeg?auto=compress&cs=tinysrgb&w=1280",
    features: [
      "Automatic invoice sync",
      "Payment reconciliation",
      "Financial reporting"
    ]
  },
  {
    id: 'paypal',
    name: "PayPal",
    description: "Accept payments globally with PayPal's secure payment processing.",
    image: "https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=1280",
    features: [
      "Multiple currency support",
      "Instant transfers",
      "Subscription billing"
    ]
  },
  {
    id: 'stripe',
    name: "Stripe",
    description: "Process credit card payments securely with Stripe's payment platform.",
    image: "https://images.pexels.com/photos/4482937/pexels-photo-4482937.jpeg?auto=compress&cs=tinysrgb&w=1280",
    features: [
      "Secure card processing",
      "Automated receipts",
      "Payment analytics"
    ]
  }
];

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleConnect = (integrationId: string) => {
    if (!user) {
      // If user is not logged in, redirect to login page with return URL
      navigate(`/login?returnUrl=/dashboard/settings?tab=integrations&integration=${integrationId}`);
      return;
    }

    // If user is logged in, redirect to settings page with integrations tab
    navigate(`/dashboard/settings?tab=integrations&integration=${integrationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1
              className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Integrations
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect your favorite tools with ZaytrixFlow
            </motion.p>
          </div>

          <div className="grid gap-8">
            {INTEGRATIONS.map((integration, index) => (
              <motion.div
                key={integration.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={integration.image}
                      alt={integration.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8 md:w-2/3">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      {integration.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {integration.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {integration.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      onClick={() => handleConnect(integration.id)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Connect
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default IntegrationsPage;