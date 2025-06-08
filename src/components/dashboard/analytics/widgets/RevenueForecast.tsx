import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueForecastProps {
  data: Array<{
    date: string;
    actual: number | null;
    forecast: number;
    lower: number;
    upper: number;
  }>;
}

const RevenueForecast: React.FC<RevenueForecastProps> = ({ data }) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
  };

  const getConfidenceLabel = (value: number, type: 'upper' | 'lower') => {
    return `${type === 'upper' ? 'High' : 'Low'} estimate: ${formatCurrency(value)}`;
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Forecast
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceInterval" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
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
              formatter={(value: number, name: string) => {
                if (name === 'upper') return [getConfidenceLabel(value, 'upper'), ''];
                if (name === 'lower') return [getConfidenceLabel(value, 'lower'), ''];
                return [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)];
              }}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                padding: '0.5rem 1rem'
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
              connectNulls={true}
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