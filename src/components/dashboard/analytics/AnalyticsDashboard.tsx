import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter } from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import PaymentTrends from './widgets/PaymentTrends';
import CollectionPerformance from './widgets/CollectionPerformance';
import AgingAnalysis from './widgets/AgingAnalysis';
import RevenueForecast from './widgets/RevenueForecast';
import ClientRisk from './widgets/ClientRisk';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import 'react-grid-layout/css/styles.css';
import { useAnalytics } from '../../../hooks/useAnalytics';

const AnalyticsDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [dateRange, setDateRange] = useState('last30');
  const { analyticsData, isLoading, handleExport } = useAnalytics(dateRange);

  // Responsive layouts for different breakpoints
  const layouts = {
    lg: [
      { i: 'payment-trends', x: 0, y: 0, w: 12, h: 8 },
      { i: 'collection-performance', x: 0, y: 8, w: 6, h: 6 },
      { i: 'aging-analysis', x: 6, y: 8, w: 6, h: 6 },
      { i: 'revenue-forecast', x: 0, y: 14, w: 8, h: 8 },
      { i: 'client-risk', x: 8, y: 14, w: 4, h: 8 },
    ],
    md: [
      { i: 'payment-trends', x: 0, y: 0, w: 12, h: 8 },
      { i: 'collection-performance', x: 0, y: 8, w: 6, h: 6 },
      { i: 'aging-analysis', x: 6, y: 8, w: 6, h: 6 },
      { i: 'revenue-forecast', x: 0, y: 14, w: 12, h: 8 },
      { i: 'client-risk', x: 0, y: 22, w: 12, h: 6 },
    ],
    sm: [
      { i: 'payment-trends', x: 0, y: 0, w: 12, h: 8 },
      { i: 'collection-performance', x: 0, y: 8, w: 12, h: 6 },
      { i: 'aging-analysis', x: 0, y: 14, w: 12, h: 6 },
      { i: 'revenue-forecast', x: 0, y: 20, w: 12, h: 8 },
      { i: 'client-risk', x: 0, y: 28, w: 12, h: 6 },
    ],
  };

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);



  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
              <p className="text-gray-500 dark:text-gray-400">Track and analyze your payment performance</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setDateRange('last7')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${dateRange === 'last7'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setDateRange('last30')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${dateRange === 'last30'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  30D
                </button>
                <button
                  onClick={() => setDateRange('last90')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${dateRange === 'last90'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  90D
                </button>
                <button
                  onClick={() => setDateRange('custom')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${dateRange === 'custom'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Calendar size={16} />
                  Custom
                </button>
              </div>

              <div className="flex items-center gap-2">
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
                  onClick={handleExport}
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Export</span>
                </motion.button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Receivables',
                value: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(analyticsData.metrics.totalReceivables),
                change: '+12.5%',
                trend: 'up',
              },
              {
                title: 'Average Days to Pay',
                value: `${analyticsData.metrics.avgDaysToPay} days`,
                change: '-2.3 days',
                trend: 'down',
              },
              {
                title: 'Collection Rate',
                value: `${analyticsData.metrics.collectionRate}%`,
                change: '+3.2%',
                trend: 'up',
              },
              {
                title: 'Overdue Amount',
                value: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(analyticsData.metrics.overdueAmount),
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
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-success-600' : 'text-error-600'
                    }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 overflow-x-hidden">
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768 }}
              cols={{ lg: 12, md: 12, sm: 12 }}
              rowHeight={30}
              width={containerWidth}
              isDraggable
              isResizable
              margin={[16, 16]}
              containerPadding={[0, 0]}
            >
              <div key="payment-trends" className="overflow-x-auto">
                <PaymentTrends data={analyticsData.paymentTrends} dateRange={dateRange} />
              </div>
              <div key="collection-performance">
                <CollectionPerformance data={analyticsData.collectionPerformance} />
              </div>
              <div key="aging-analysis">
                <AgingAnalysis data={analyticsData.agingAnalysis} />
              </div>
              <div key="revenue-forecast" className="overflow-x-auto">
                <RevenueForecast data={analyticsData.revenueForecast} />
              </div>
              <div key="client-risk">
                <ClientRisk data={analyticsData.clientRisk} />
              </div>
            </ResponsiveGridLayout>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
