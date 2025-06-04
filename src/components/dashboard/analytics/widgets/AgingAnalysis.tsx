import React from 'react';
import { motion } from 'framer-motion';

const AgingAnalysis: React.FC = () => {
  const data = [
    { range: 'Current', amount: 45000, percentage: 45 },
    { range: '1-30', amount: 25000, percentage: 25 },
    { range: '31-60', amount: 15000, percentage: 15 },
    { range: '61-90', amount: 10000, percentage: 10 },
    { range: '90+', amount: 5000, percentage: 5 },
  ];

  const getColor = (index: number) => {
    const colors = [
      'bg-success-500',
      'bg-warning-500',
      'bg-error-500',
      'bg-primary-500',
      'bg-secondary-500',
    ];
    return colors[index];
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Aging Analysis
      </h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.range} days
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${item.amount.toLocaleString()}
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`absolute top-0 left-0 h-full ${getColor(index)} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgingAnalysis;