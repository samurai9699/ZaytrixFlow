import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter } from 'lucide-react';
import GridLayout from 'react-grid-layout';
import PaymentTrends from './widgets/PaymentTrends';
import CollectionPerformance from './widgets/CollectionPerformance';
import AgingAnalysis from './widgets/AgingAnalysis';
import RevenueForecast from './widgets/RevenueForecast';
import ClientRisk from './widgets/ClientRisk';
import 'react-grid-layout/css/styles.css';

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30');
  const [filters, setFilters] = useState({
    industry: 'all',
    status: 'all',
    amount: [0, 100000],
  });

  const layout = [
    { i: 'payment-trends', x: 0, y: 0, w: 12, h: 8 },
    { i: 'collection-performance', x: 0, y: 8, w: 6, h: 6 },
    { i: 'aging-analysis', x: 6, y: 8, w: 6, h: 6 },
    { i: 'revenue-forecast', x: 0, y: 14, w: 8, h: 8 },
    { i: 'client-risk', x: 8, y: 14, w: 4, h: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and analyze your payment performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDateRange('last7')}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                dateRange === 'last7'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setDateRange('last30')}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                dateRange === 'last30'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setDateRange('last90')}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                dateRange === 'last90'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              90D
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
                dateRange === 'custom'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar size={16} />
              Custom
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={20} />
            Export
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Receivables',
            value: '$124,500',
            change: '+12.5%',
            trend: 'up',
          },
          {
            title: 'Average Days to Pay',
            value: '18 days',
            change: '-2.3 days',
            trend: 'down',
          },
          {
            title: 'Collection Rate',
            value: '94%',
            change: '+3.2%',
            trend: 'up',
          },
          {
            title: 'Overdue Amount',
            value: '$8,250',
            change: '-15.4%',
            trend: 'down',
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {metric.title}
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-success-600' : 'text-error-600'
              }`}>
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          isDraggable
          isResizable
          margin={[16, 16]}
        >
          <div key="payment-trends">
            <PaymentTrends dateRange={dateRange} />
          </div>
          <div key="collection-performance">
            <CollectionPerformance />
          </div>
          <div key="aging-analysis">
            <AgingAnalysis />
          </div>
          <div key="revenue-forecast">
            <RevenueForecast />
          </div>
          <div key="client-risk">
            <ClientRisk />
          </div>
        </GridLayout>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;