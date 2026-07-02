import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../../utils/dashboardUtils';

interface PaymentTrendsProps {
  data: Array<{
    date: string;
    received: number;
    expected: number;
  }>;
  dateRange: string;
}

const PaymentTrends: React.FC<PaymentTrendsProps> = ({ data, dateRange }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (dateRange) {
      case 'last7':
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      case 'last30':
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      case 'last90':
        return date.toLocaleDateString(undefined, { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Trends</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Received</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Expected</span>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                padding: '0.5rem 1rem'
              }}
            />
            <Area
              type="monotone"
              dataKey="received"
              stroke="#6366F1"
              fillOpacity={1}
              fill="url(#colorReceived)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expected"
              stroke="#9CA3AF"
              fillOpacity={1}
              fill="url(#colorExpected)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentTrends;
