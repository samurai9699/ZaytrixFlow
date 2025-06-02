import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../constants';
import { 
  BellRing, 
  LineChart, 
  Users, 
  FileText, 
  Globe, 
  CreditCard 
} from 'lucide-react';

const Features: React.FC = () => {
  // Map feature icon names to Lucide React components
  const getIcon = (iconName: string) => {
    const iconProps = { 
      className: "h-8 w-8 text-primary-600 dark:text-primary-400",
      strokeWidth: 1.5
    };
    
    switch (iconName) {
      case 'BellRing': return <BellRing {...iconProps} />;
      case 'LineChart': return <LineChart {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'FileText': return <FileText {...iconProps} />;
      case 'Globe': return <Globe {...iconProps} />;
      case 'CreditCard': return <CreditCard {...iconProps} />;
      default: return <BellRing {...iconProps} />;
    }
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-50 dark:bg-secondary-900/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features to Streamline Your Invoicing
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Designed specifically for freelancers who value their time and want to maintain great client relationships
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="h-full p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-primary-50 dark:group-hover:from-gray-800 dark:group-hover:to-primary-900/30">
                <div className="mb-5 inline-block p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>

              {/* Flip effect on hover - shown on desktop only */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white p-8 flex flex-col justify-center opacity-0 scale-95 rotate-y-180 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-y-0 transition-all duration-300 transform-gpu backface-hidden pointer-events-none hidden lg:flex">
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/90">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;