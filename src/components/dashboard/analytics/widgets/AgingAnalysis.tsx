import React from 'react';
import { motion } from 'framer-motion';

interface AgingAnalysisProps {
  data: Array<{
    range: string;
    amount: number;
    percentage: number;
  }>;
}

const AgingAnalysis: React.FC<AgingAnalysisProps> = ({ data }) => {
  // Validate data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No aging data available</p>
      </div>
    );
  }

  const getColor = (index: number) => {
    const colors = [
      'bg-success-500',
      'bg-warning-400',
      'bg-warning-500',
      'bg-error-400',
      'bg-error-500',
    ];
    return colors[index % colors.length];
  };

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Aging Analysis
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(data.reduce((sum, item) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0))}
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.range || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getColor(index)}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.range} days
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {typeof item.percentage === 'number' ? item.percentage : 0}%
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-24 text-right">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${typeof item.percentage === 'number' ? Math.max(0, Math.min(100, item.percentage)) : 0}%` }}
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