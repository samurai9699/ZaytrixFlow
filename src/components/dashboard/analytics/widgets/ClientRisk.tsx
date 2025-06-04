import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ClientRisk: React.FC = () => {
  const clients = [
    { name: 'Acme Corp', risk: 'high', amount: 12500, days: 45 },
    { name: 'TechStart Inc', risk: 'medium', amount: 8750, days: 32 },
    { name: 'Design Studio', risk: 'low', amount: 5000, days: 15 },
    { name: 'Global Services', risk: 'high', amount: 15000, days: 60 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
      case 'medium':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'low':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client Risk</h3>
        <AlertTriangle className="text-warning-500" size={20} />
      </div>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">{client.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(client.risk)}`}>
                {client.risk}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                ${client.amount.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {client.days} days
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientRisk;