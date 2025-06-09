import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from './Navbar';

const Hero: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-20 flex items-center bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900"
    >
      <Navbar />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-secondary-200 dark:bg-secondary-900 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium mb-6">
                Launching Soon
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                Get Paid{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-300">
                    On Time, Every Time
                  </span>
                </span>
              </h1>

              <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
                Automated invoice reminders that handle the awkward follow-ups, so you can focus on what you do best. Never chase payments again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#waitlist"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium text-lg shadow-lg hover:shadow-primary-500/20 flex items-center justify-center gap-2 group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Waitlist
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </motion.a>
                <motion.a
                  href="#features"
                  className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium text-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See Features
                </motion.a>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              {/* Hero image/illustration */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 dark:from-gray-800/80 dark:to-gray-900/20 backdrop-blur-sm z-10 p-6 sm:p-8 flex flex-col">
                  <div className="mb-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Dashboard</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-900/30 p-3 rounded-lg mb-4 border border-primary-100 dark:border-primary-800">
                      <p className="text-sm text-primary-800 dark:text-primary-300">
                        3 invoices need attention
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">$2,450</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Paid this month</p>
                      <p className="text-xl font-bold text-success-600 dark:text-success-400">$8,725</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Built on Bolt Badge - Fixed positioning */}
      <motion.a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-16 right-4 sm:top-20 sm:right-6 md:top-24 md:right-8 lg:top-20 lg:right-6 xl:top-24 xl:right-8 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={`/assets/built-on-bolt-${isDarkMode ? 'white' : 'black'}.png`}
          alt="Built on Bolt"
          className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 object-contain transition-all duration-300 hover:opacity-80 drop-shadow-lg"
        />
      </motion.a>
    </section>
  );
};

export default Hero;