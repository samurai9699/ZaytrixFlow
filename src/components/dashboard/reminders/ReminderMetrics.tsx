import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface ReminderMetricsData {
  total: number;
  pending: number;
  sent: number;
  overdue: number;
  completionRate: number;
}

const ReminderMetrics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ReminderMetricsData>({
    total: 0,
    pending: 0,
    sent: 0,
    overdue: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const now = new Date().toISOString();

      // Fetch all reminders for the user
      const { data: reminders, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const reminderStats = (reminders || []).reduce((acc, reminder) => {
        acc.total++;

        switch (reminder.status) {
          case 'pending':
            acc.pending++;
            break;
          case 'sent':
            acc.sent++;
            break;
          case 'completed':
            acc.completed++;
            break;
          default:
            break;
        }

        // Check for overdue reminders
        if (reminder.due_date < now && reminder.status !== 'completed') {
          acc.overdue++;
        }

        return acc;
      }, {
        total: 0,
        pending: 0,
        sent: 0,
        completed: 0,
        overdue: 0
      });

      setMetrics({
        ...reminderStats,
        completionRate: reminderStats.total > 0
          ? Math.round((reminderStats.completed / reminderStats.total) * 100)
          : 0
      });

    } catch (error) {
      console.error('Error fetching reminder metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user, fetchMetrics]);

  const metrics_data = [
    {
      title: 'Total Reminders',
      value: metrics.total,
      icon: Bell,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30'
    },
    {
      title: 'Pending',
      value: metrics.pending,
      icon: Clock,
      color: 'text-warning-500',
      bgColor: 'bg-warning-100 dark:bg-warning-900/30'
    },
    {
      title: 'Sent',
      value: metrics.sent,
      icon: CheckCircle,
      color: 'text-success-500',
      bgColor: 'bg-success-100 dark:bg-success-900/30'
    },
    {
      title: 'Overdue',
      value: metrics.overdue,
      icon: AlertCircle,
      color: 'text-error-500',
      bgColor: 'bg-error-100 dark:bg-error-900/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics_data.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.title}
              </h3>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loading ? '-' : metric.value}
                </p>
                {metric.title === 'Completion Rate' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">%</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ReminderMetrics;