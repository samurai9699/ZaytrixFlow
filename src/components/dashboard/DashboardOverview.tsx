import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Users,
  FileText
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
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import { formatCurrency } from '../../utils/dashboardUtils';

const DashboardOverview: React.FC = () => {
  const { metrics, chartData, recentActivity, isLoading } = useDashboardMetrics();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label} {new Date().getFullYear()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600/10 to-secondary-600/10 dark:from-primary-900/20 dark:to-secondary-900/20 backdrop-blur-xl rounded-2xl p-6 border border-primary-200/20 dark:border-primary-800/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Here's what's happening with your invoices today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Outstanding</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(metrics.unpaidAmount + metrics.pendingAmount)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Unpaid Invoices',
            value: metrics.totalUnpaid,
            amount: metrics.unpaidAmount,
            icon: <AlertCircle className="text-error-600 dark:text-error-400" />,
            change: '+2 from last month',
            positive: true,
            gradient: 'from-error-500/10 to-error-600/10'
          },
          {
            title: 'Pending Invoices',
            value: metrics.totalPending,
            amount: metrics.pendingAmount,
            icon: <Clock className="text-warning-600 dark:text-warning-400" />,
            change: '+1 from last month',
            positive: true,
            gradient: 'from-warning-500/10 to-warning-600/10'
          },
          {
            title: 'Upcoming Invoices',
            value: metrics.totalUpcoming,
            amount: metrics.upcomingAmount,
            icon: <Calendar className="text-primary-600 dark:text-primary-400" />,
            change: '+3 from last month',
            positive: true,
            gradient: 'from-primary-500/10 to-primary-600/10'
          },
          {
            title: 'Paid Invoices',
            value: metrics.totalPaid,
            amount: metrics.paidAmount,
            icon: <CheckCircle className="text-success-600 dark:text-success-400" />,
            change: '+5 from last month',
            positive: true,
            gradient: 'from-success-500/10 to-success-600/10'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${
                stat.positive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
              }`}>
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {formatCurrency(stat.amount)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoice Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Invoice Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unpaid vs Paid invoices over the last 6 months
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUnpaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="unpaid"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUnpaid)"
                  name="Unpaid"
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPaid)"
                  name="Paid"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Quick Stats
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Key performance indicators
              </p>
            </div>
            <DollarSign className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="space-y-6">
            {[
              {
                label: 'Average Invoice Value',
                value: formatCurrency((metrics.unpaidAmount + metrics.pendingAmount + metrics.upcomingAmount + metrics.paidAmount) / Math.max(1, metrics.totalUnpaid + metrics.totalPending + metrics.totalUpcoming + metrics.totalPaid)),
                icon: <DollarSign className="h-4 w-4" />,
                color: 'text-primary-600 dark:text-primary-400'
              },
              {
                label: 'Collection Rate',
                value: `${Math.round((metrics.totalPaid / Math.max(1, metrics.totalUnpaid + metrics.totalPending + metrics.totalUpcoming + metrics.totalPaid)) * 100)}%`,
                icon: <TrendingUp className="h-4 w-4" />,
                color: 'text-success-600 dark:text-success-400'
              },
              {
                label: 'Total Clients',
                value: metrics.totalClients.toString(),
                icon: <Users className="h-4 w-4" />,
                color: 'text-secondary-600 dark:text-secondary-400'
              },
              {
                label: 'This Month Revenue',
                value: formatCurrency(metrics.paidAmount),
                icon: <CheckCircle className="h-4 w-4" />,
                color: 'text-success-600 dark:text-success-400'
              }
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Latest updates on your invoices
            </p>
          </div>
          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        
        <div className="space-y-4">
          {recentActivity.length > 0 ? recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`w-2 h-2 mt-2 rounded-full ${
                activity.type === 'success' ? 'bg-success-500' :
                activity.type === 'error' ? 'bg-error-500' :
                activity.type === 'warning' ? 'bg-warning-500' :
                'bg-primary-500'
              }`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
            </div>
          )) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Create your first invoice to get started</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
