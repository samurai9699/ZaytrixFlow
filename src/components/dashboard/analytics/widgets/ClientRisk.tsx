import React from 'react';
import { motion } from 'framer-motion';

interface ClientRiskProps {
  data: Array<{
    name: string;
    riskScore: number;
    overdueAmount: number;
    industry: string;
  }>;
}

const ClientRisk: React.FC<ClientRiskProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'bg-success-500';
    if (score <= 60) return 'bg-warning-500';
    return 'bg-error-500';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Client Risk Analysis
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          By Overdue Amount
        </div>
      </div>

      <div className="space-y-4">
        {data.sort((a, b) => b.overdueAmount - a.overdueAmount).slice(0, 5).map((client, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {client.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {client.industry}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(client.overdueAmount)}
                </p>
                <p className={`text-xs ${client.riskScore <= 30 ? 'text-success-600' :
                    client.riskScore <= 60 ? 'text-warning-600' :
                      'text-error-600'
                  }`}>
                  {getRiskLabel(client.riskScore)}
                </p>
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${client.riskScore}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`absolute top-0 left-0 h-full ${getRiskColor(client.riskScore)} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-[calc(100%-2rem)] text-gray-500 dark:text-gray-400">
          No client risk data available
        </div>
      )}
    </div>
  );
};

export default ClientRisk;