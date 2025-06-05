import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const AboutPage: React.FC = () => {
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
              About ZaytrixFlow
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Helping freelancers get paid on time with automated solutions
            </motion.p>
          </div>

          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              At ZaytrixFlow, we're on a mission to eliminate the stress of late payments for freelancers worldwide. We believe that getting paid shouldn't be a full-time job, which is why we've created an intelligent platform that automates payment follow-ups while maintaining great client relationships.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform combines cutting-edge technology with human-centered design to create a seamless experience that helps freelancers focus on what they do best - their work.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Mail className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-300">hello@zaytrixflow.com</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Phone className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <MapPin className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Visit Us</h3>
              <p className="text-gray-600 dark:text-gray-300">123 Innovation Drive<br />San Francisco, CA 94107</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;