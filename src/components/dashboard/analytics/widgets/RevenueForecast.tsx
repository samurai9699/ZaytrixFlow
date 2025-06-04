import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2025-04', actual: 4000, forecast: 4200, lower: 3800, upper: 4600 },
  { date: '2025-05', actual: 3000, forecast: 3500, lower: 3200, upper: 3800 },
  { date: '2025-06', actual: null, forecast: 4500, lower: 4000, upper: 5000 },
  { date: '2025-07', actual: null, forecast: 5000, lower: 4500, upper: 5500 },
  { date: '2025-08', actual: null, forecast: 4800, lower: 4300, upper: 5300 },
  { date: '2025-09', actual: null, forecast: 5200, lower: 4700, upper: 5700 },
];

const RevenueForecast: React.FC = () => {
  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Revenue Forecast
      </h3>

      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="confidenceInterval" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
              }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
              }}
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confidenceInterval)"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="url(#confidenceInterval)"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#6366F1"
              fill="none"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#6366F1"
              strokeDasharray="5 5"
              fill="none"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueForecast;