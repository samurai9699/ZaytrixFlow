import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PrivacyPolicyPage: React.FC = () => {
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
              Privacy Policy
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
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Introduction</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  At ZaytrixFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Information We Collect</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Account information (name, email, password)</li>
                    <li>Business information (company name, address)</li>
                    <li>Payment information (processed securely through our payment providers)</li>
                    <li>Usage data and analytics</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How We Use Your Information</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Provide and maintain our service</li>
                    <li>Process your payments and send invoices</li>
                    <li>Send you important updates and notifications</li>
                    <li>Improve our service and develop new features</li>
                    <li>Detect and prevent fraud</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Data Security</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Data Sharing</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-300">
                  <li>Service providers who assist in operating our service</li>
                  <li>Law enforcement when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Rights</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-300">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Email: privacy@zaytrixflow.com<br />
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

export default PrivacyPolicyPage;