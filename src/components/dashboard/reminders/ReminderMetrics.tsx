import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sent: 4, opened: 3, paid: 2 },
  { name: 'Tue', sent: 3, opened: 2, paid: 1 },
  { name: 'Wed', sent: 5, opened: 4, paid: 3 },
  { name: 'Thu', sent: 6, opened: 4, paid: 2 },
  { name: 'Fri', sent: 4, opened: 3, paid: 2 },
  { name: 'Sat', sent: 3, opened: 2, paid: 1 },
  { name: 'Sun', sent: 4, opened: 3, paid: 2 },
];

const ReminderMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          title: 'Scheduled',
          value: '24',
          icon: <Clock className="text-primary-600 dark:text-primary-400" />,
          change: '+12.5%',
          positive: true
        },
        {
          title: 'Sent Today',
          value: '8',
          icon: <Bell className="text-warning-600 dark:text-warning-400" />,
          change: '-2.3%',
          positive: false
        },
        {
          title: 'Opened',
          value: '68%',
          icon: <CheckCircle className="text-success-600 dark:text-success-400" />,
          change: '+8.1%',
          positive: true
        },
        {
          title: 'Failed',
          value: '2',
          icon: <AlertCircle className="text-error-600 dark:text-error-400" />,
          change: '+1',
          positive: false
        }
      ].map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {metric.icon}
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${
              metric.positive ? 'text-success-600' : 'text-error-600'
            }`}>
              {metric.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {metric.value}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
        </motion.div>
      ))}

      {/* Chart */}
      <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Reminder Performance
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sent"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorSent)"
              />
              <Area
                type="monotone"
                dataKey="opened"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorOpened)"
              />
              <Area
                type="monotone"
                dataKey="paid"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorPaid)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReminderMetrics;