import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          New Invoice
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Outstanding',
            value: '$12,450',
            icon: <DollarSign className="text-primary-600 dark:text-primary-400" />,
            change: '+12.5%',
            positive: true
          },
          {
            title: 'Overdue',
            value: '$2,150',
            icon: <Clock className="text-warning-600 dark:text-warning-400" />,
            change: '-2.3%',
            positive: false
          },
          {
            title: 'Paid',
            value: '$28,750',
            icon: <CheckCircle className="text-success-600 dark:text-success-400" />,
            change: '+8.1%',
            positive: true
          },
          {
            title: 'Pending',
            value: '$4,250',
            icon: <AlertCircle className="text-error-600 dark:text-error-400" />,
            change: '+3.2%',
            positive: true
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${
                stat.positive ? 'text-success-600' : 'text-error-600'
              }`}>
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Invoice Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              title: 'Invoice Paid',
              description: 'Client XYZ paid invoice #1234',
              time: '2 hours ago',
              type: 'success'
            },
            {
              title: 'Invoice Overdue',
              description: 'Invoice #5678 is 3 days overdue',
              time: '1 day ago',
              type: 'warning'
            },
            {
              title: 'New Invoice',
              description: 'Created invoice #9012 for Client ABC',
              time: '2 days ago',
              type: 'info'
            }
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className={`w-2 h-2 mt-2 rounded-full ${
                activity.type === 'success' ? 'bg-success-500' :
                activity.type === 'warning' ? 'bg-warning-500' :
                'bg-primary-500'
              }`} />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;