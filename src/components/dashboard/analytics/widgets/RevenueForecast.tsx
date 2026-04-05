import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Info } from 'lucide-react';

interface RevenueForecastProps {
  data: Array<{
    date: string;
    actual: number | null;
    forecast: number;
    lower: number;
    upper: number;
    confidence: number;
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

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  const getTooltipContent = (name: string, confidence: number) => {
    switch (name) {
      case 'upper':
        return `Upper bound (${formatConfidence(confidence)})`;
      case 'lower':
        return `Lower bound (${formatConfidence(confidence)})`;
      case 'actual':
        return 'Actual Revenue';
      case 'forecast':
        return 'Forecasted Revenue';
      default:
        return name;
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revenue Forecast
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            6-month projection with confidence intervals
          </p>
        </div>
        <div className="relative group">
          <Info className="w-5 h-5 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-72 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Forecast based on historical data, seasonality, and growth trends. 
              Confidence intervals widen with time to reflect increasing uncertainty.
            </p>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value: number, name: string, item: unknown) => {
                const props = item as { payload?: { payload?: { index: number } } };
                const idx = props?.payload?.payload?.index ?? 0;
                const rowItem = data[idx];
                return [formatCurrency(value), getTooltipContent(name, rowItem.confidence)];
              }}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                padding: '0.5rem 1rem'
              }}
            />
            <Legend />
            
            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={0.2}
              name="Confidence Interval"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={0.2}
            />
            
            {/* Actual Revenue */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#actualGradient)"
              name="Actual"
            />
            
            {/* Forecasted Revenue */}
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#9333EA"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#forecastGradient)"
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest Actual</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(data.find(d => d.actual !== null)?.actual || 0)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Next Month Forecast</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(data.find(d => d.actual === null)?.forecast || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueForecast;
