import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';

const TermsPage: React.FC = () => {
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
              Terms of Service
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Last updated: March 15, 2025
            </motion.p>
          </div>

          <motion.div
            className="prose prose-lg max-w-none dark:prose-invert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Agreement to Terms</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing or using ZaytrixFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Use License</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Permission is granted to temporarily access ZaytrixFlow for personal or business use, subject to the following conditions:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>You must not modify or copy the materials</li>
                    <li>You must not use the materials for any commercial purpose</li>
                    <li>You must not attempt to reverse engineer any software</li>
                    <li>You must not remove any copyright or proprietary notations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Payment Terms</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  You agree to pay all fees associated with your subscription plan. Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. User Responsibilities</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    As a user of ZaytrixFlow, you are responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Maintaining the confidentiality of your account</li>
                    <li>All activities that occur under your account</li>
                    <li>Ensuring your data complies with applicable laws</li>
                    <li>Maintaining accurate contact and payment information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Limitation of Liability</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  ZaytrixFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Changes to Terms</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Contact Information</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Questions about the Terms of Service should be sent to:<br />
                  Email: legal@zaytrixflow.com<br />
                  Address: 123 Innovation Drive, San Francisco, CA 94107
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;