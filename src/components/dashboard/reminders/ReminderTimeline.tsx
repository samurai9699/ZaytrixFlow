import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import ReminderDetailsModal from './ReminderDetailsModal';
import CreateReminderModal from './CreateReminderModal';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: string;
  invoice_id?: string;
  invoice?: {
    id: string;
    amount: number;
    client_name: string;
  };
}

const ReminderTimeline: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchReminders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('reminders')
        .select(`
          id,
          title,
          description,
          due_date,
          status,
          invoice_id,
          invoice:invoices!invoice_id (
            id,
            amount,
            client_name
          )
        `)
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })
        .limit(10);

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        invoice: item.invoice?.[0] || null
      }));

      setReminders(transformedData as Reminder[]);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user, fetchReminders]);

  const getStatusIcon = (reminder: Reminder) => {
    const now = new Date();
    const dueDate = new Date(reminder.due_date);
    const isOverdue = dueDate < now && reminder.status !== 'completed';

    if (isOverdue) {
      return <AlertCircle className="text-error-500" size={20} />;
    }

    switch (reminder.status) {
      case 'pending':
        return <Clock className="text-primary-500" size={20} />;
      case 'sent':
        return <Bell className="text-warning-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-success-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (reminder: Reminder) => {
    const now = new Date();
    const dueDate = new Date(reminder.due_date);
    const isOverdue = dueDate < now && reminder.status !== 'completed';

    if (isOverdue) {
      return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
    }

    switch (reminder.status) {
      case 'pending':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
      case 'sent':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'completed':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDueDate = (date: string) => {
    const dueDate = new Date(date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays < -1) {
      return `${Math.abs(diffDays)} days ago`;
    } else {
      return `In ${diffDays} days`;
    }
  };

  const handleReminderClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setShowDetailsModal(true);
  };

  const handleEditReminder = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchReminders();
  };

  const handleDeleteSuccess = () => {
    fetchReminders();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Reminders</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : reminders.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No upcoming reminders
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => handleReminderClick(reminder)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(reminder)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {reminder.title}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reminder)}`}>
                      {reminder.status}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDueDate(reminder.due_date)}
                    </p>
                    {reminder.invoice && (
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ${reminder.invoice.amount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {reminder.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                      {reminder.description}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reminder Details Modal */}
      <ReminderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        reminder={selectedReminder}
        onDelete={handleDeleteSuccess}
        onEdit={handleEditReminder}
      />

      {/* Edit Reminder Modal */}
      <CreateReminderModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        editReminder={selectedReminder}
      />
    </div>
  );
};

export default ReminderTimeline;