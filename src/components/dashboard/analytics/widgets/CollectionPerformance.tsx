import React from 'react';
import { motion } from 'framer-motion';

const CollectionPerformance: React.FC = () => {
  const metrics = [
    { label: '0-30 days', value: 85, target: 90 },
    { label: '31-60 days', value: 70, target: 80 },
    { label: '61-90 days', value: 45, target: 60 },
    { label: '90+ days', value: 25, target: 40 },
  ];

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Collection Performance
      </h3>

      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {metric.value}%
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
              />
              <div
                className="absolute top-0 h-full border-r-2 border-warning-500"
                style={{ left: `${metric.target}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionPerformance;