import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';

const PRICING_PLANS = [
  {
    id: 'free',
    title: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for freelancers just getting started",
    features: [
      "Up to 5 clients",
      "3 invoice templates",
      "Basic reminder schedule",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    id: 'pro',
    title: "Pro",
    price: { 
      monthly: STRIPE_PRODUCTS.pro.price, 
      annual: Math.round(STRIPE_PRODUCTS.pro.price * 12 * 0.8) 
    },
    description: STRIPE_PRODUCTS.pro.description,
    features: [
      "Up to 20 clients",
      "10 invoice templates",
      "Advanced reminder schedule",
      "Payment tracking dashboard",
      "Client payment history",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: 'premium',
    title: "Premium",
    price: { 
      monthly: STRIPE_PRODUCTS.premium.price, 
      annual: Math.round(STRIPE_PRODUCTS.premium.price * 12 * 0.8) 
    },
    description: STRIPE_PRODUCTS.premium.description,
    features: [
      "Unlimited clients",
      "Custom invoice templates",
      "AI-powered reminder optimization",
      "Advanced analytics dashboard",
      "Client portal access",
      "Priority phone support",
      "White-labeling options",
    ],
    cta: "Start Free Trial",
  },
];

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();

  return (
    <section id="pricing" className="py-16 md:py-24 bg-primary-50 dark:bg-gray-900 relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2Nmgtdi02em0tNiA2aDZ2Nmgtdi02em02IDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Nmg2di02aC02em02IDZ2Nmg2di02aC02em0tMTIgMGg2djZoLTZ2LTZ6bTEyIDBoNnY2aC12LTZ6bS02IDZoNnY2aC12LTZ6bTYgMGg2djZoLTZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the plan that's right for your freelance business
          </motion.p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isAnnual ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Annual
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 
                ${plan.popular 
                  ? 'bg-white dark:bg-gray-800 border-2 border-primary-500 dark:border-primary-400 shadow-xl md:-mt-4 md:mb-4' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ 
                y: -5, 
                boxShadow: plan.popular 
                  ? '0 25px 50px -12px rgba(99, 102, 241, 0.25)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.1)' 
              }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly !== 0 && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 mr-3 mt-0.5 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
                        <Check size={12} />
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={plan.price.monthly === 0 ? "/register" : `/checkout/${plan.id}?billing=${isAnnual ? 'annual' : 'monthly'}`}
                  className={`block w-full py-3 px-6 text-center rounded-lg transition-all 
                    ${plan.popular 
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg hover:shadow-primary-500/20' 
                      : 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
                >
                  {user ? (plan.price.monthly === 0 ? 'Get Started' : 'Subscribe Now') : plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;