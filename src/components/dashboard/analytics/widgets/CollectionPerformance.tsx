import React from 'react';
import { motion } from 'framer-motion';

interface CollectionPerformanceProps {
  data: Array<{
    label: string;
    value: number;
    target: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
}

const CollectionPerformance: React.FC<CollectionPerformanceProps> = ({ data }) => {
  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-success-500';
      case 'down':
        return 'text-error-500';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 1) return 'bg-success-500';
    if (ratio >= 0.8) return 'bg-warning-400';
    if (ratio >= 0.6) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Collection Performance
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          vs Target
        </div>
      </div>

      <div className="space-y-6">
        {data.map((metric, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.label}
                </span>
                {metric.trend && (
                  <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.value}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Target: {metric.target}%
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`absolute top-0 left-0 h-full ${getProgressColor(metric.value, metric.target)} rounded-full`}
              />
              <div
                className="absolute top-0 h-full border-r-2 border-warning-500"
                style={{ left: `${metric.target}%` }}
              />
            </div>
            {metric.value > metric.target && (
              <div
                className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-success-500 rounded-full"
                style={{ marginTop: '10px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionPerformance;