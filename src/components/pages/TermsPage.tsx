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
                  By accessing or using ZaytrixFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Use License</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Permission is granted to temporarily use ZaytrixFlow for personal or business purposes, subject to the following conditions:
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
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Account Terms</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    To use ZaytrixFlow, you must:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Not share your account credentials</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Payment Terms</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    By subscribing to ZaytrixFlow:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>You agree to pay all fees associated with your subscription</li>
                    <li>Payments are non-refundable unless required by law</li>
                    <li>We may change pricing with 30 days notice</li>
                    <li>You are responsible for any applicable taxes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Limitation of Liability</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  ZaytrixFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. We are not liable for any payment delays or failures by your clients.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Termination</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Changes to Terms</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the service after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">8. Contact Information</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Questions about the Terms should be sent to us at:<br />
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