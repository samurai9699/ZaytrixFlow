import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const FAQ_ITEMS = [
  {
    question: "How do I create an invoice?",
    answer: "Creating an invoice is simple! From your dashboard, click the 'New Invoice' button. Fill in your client's details, add line items, and customize the payment terms. You can also save invoice templates for future use."
  },
  {
    question: "How do I set up payment reminders?",
    answer: "Navigate to the 'Reminders' section in your dashboard. You can create custom reminder schedules for each invoice or use our smart templates. Set the frequency, timing, and customize the message for each reminder."
  },
  {
    question: "Can I customize the reminder messages?",
    answer: "Yes! You can fully customize reminder messages using our template editor. Add your brand voice, include specific payment instructions, and use variables like {{client_name}} and {{amount}} for personalization."
  }
];

const CATEGORIES = [
  "Getting Started",
  "Invoicing",
  "Payments",
  "Reminders",
  "Account Settings"
];

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Getting Started');

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
              Help Center
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Find answers to your questions about ZaytrixFlow
            </motion.p>

            <motion.div
              className="max-w-2xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h2>
                <ul className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                  >
                    <button
                      onClick={() => setActiveItem(activeItem === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={`transform transition-transform ${
                          activeItem === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeItem === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenterPage;