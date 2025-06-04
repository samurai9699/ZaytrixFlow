import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PaymentTrendsProps {
  dateRange: string;
}

const data = [
  { date: '2025-03-01', received: 4000, expected: 3000 },
  { date: '2025-03-02', received: 3000, expected: 2800 },
  { date: '2025-03-03', received: 5000, expected: 4200 },
  { date: '2025-03-04', received: 2780, expected: 3900 },
  { date: '2025-03-05', received: 1890, expected: 4800 },
  { date: '2025-03-06', received: 2390, expected: 3800 },
  { date: '2025-03-07', received: 3490, expected: 4300 },
];

const PaymentTrends: React.FC<PaymentTrendsProps> = ({ dateRange }) => {
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
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="received"
              stroke="#6366F1"
              fillOpacity={1}
              fill="url(#colorReceived)"
            />
            <Area
              type="monotone"
              dataKey="expected"
              stroke="#9CA3AF"
              fillOpacity={1}
              fill="url(#colorExpected)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentTrends;