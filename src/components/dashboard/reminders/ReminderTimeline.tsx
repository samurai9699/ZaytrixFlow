import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

const MOCK_REMINDERS = [
  {
    id: 1,
    type: 'pre-due',
    client: 'Acme Corp',
    amount: 1500,
    dueDate: '2025-03-15',
    status: 'scheduled',
  },
  {
    id: 2,
    type: 'due',
    client: 'TechStart Inc',
    amount: 2800,
    dueDate: '2025-03-10',
    status: 'sent',
  },
  {
    id: 3,
    type: 'overdue',
    client: 'Design Studio',
    amount: 950,
    dueDate: '2025-03-01',
    status: 'failed',
  },
];

const ReminderTimeline: React.FC = () => {
  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'pre-due':
        return <Clock className="text-primary-500" size={20} />;
      case 'due':
        return <Bell className="text-warning-500" size={20} />;
      case 'overdue':
        return <AlertCircle className="text-error-500" size={20} />;
      default:
        return <CheckCircle className="text-success-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
      case 'sent':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      case 'failed':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Reminders</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {MOCK_REMINDERS.map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {getStatusIcon(reminder.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {reminder.client}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                    {reminder.status}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center gap-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ${reminder.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <span className="sr-only">Edit reminder</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReminderTimeline;