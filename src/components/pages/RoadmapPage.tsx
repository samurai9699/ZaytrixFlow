import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ROADMAP_ITEMS = [
  {
    quarter: "Q3 2025",
    title: "Client Portal",
    description: "A dedicated portal for clients to view invoices, make payments, and manage their billing preferences.",
    status: "in-progress",
    features: [
      "Self-service payment management",
      "Invoice history and analytics",
      "Communication timeline"
    ]
  },
  {
    quarter: "Q4 2025",
    title: "AI Payment Predictions",
    description: "Machine learning algorithms to predict payment patterns and optimize reminder timing.",
    status: "planned",
    features: [
      "Payment behavior analysis",
      "Smart reminder scheduling",
      "Risk assessment"
    ]
  },
  {
    quarter: "Q1 2026",
    title: "Smart Email Automation",
    description: "AI-powered email system that sends timely, personalized invoice reminders to your clients",
    status: "upcoming",
    features: [
      "Send from custom email/domain (SMTP support)",
      "AI-based reply detection and sequence control",
      "Open & click tracking with analytics"
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="text-success-500" />;
    case 'in-progress':
      return <Clock className="text-warning-500" />;
    default:
      return <Sparkles className="text-primary-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
    case 'in-progress':
      return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
    default:
      return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
  }
};

const RoadmapPage: React.FC = () => {
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
              Product Roadmap
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Upcoming features and improvements
            </motion.p>
          </div>

          <div className="space-y-12">
            {ROADMAP_ITEMS.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                {index < ROADMAP_ITEMS.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                )}
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                      {getStatusIcon(item.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {item.quarter}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {item.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {item.features.map((feature, featureIndex) => (
                          <li 
                            key={featureIndex}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
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

export default RoadmapPage;