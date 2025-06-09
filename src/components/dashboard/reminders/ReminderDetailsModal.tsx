import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

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

interface ReminderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reminder: Reminder | null;
    onDelete: () => void;
    onEdit: () => void;
}

const ReminderDetailsModal: React.FC<ReminderDetailsModalProps> = ({
    isOpen,
    onClose,
    reminder,
    onDelete,
    onEdit,
}) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!isOpen || !reminder) return null;

    const handleDelete = async () => {
        if (!user || !reminder) return;

        try {
            setLoading(true);

            const { error } = await supabase
                .from('reminders')
                .delete()
                .eq('id', reminder.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success('Reminder deleted successfully!');
            onDelete();
            onClose();
        } catch (error) {
            console.error('Error deleting reminder:', error);
            toast.error('Failed to delete reminder. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
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

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                                <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reminder Details</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">View and manage reminder</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {reminder.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                                    {reminder.status}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(reminder.due_date)}
                                </span>
                            </div>
                        </div>

                        {reminder.description && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {reminder.description}
                                </p>
                            </div>
                        )}

                        {reminder.invoice && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Linked Invoice
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {reminder.invoice.client_name}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${reminder.invoice.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-error-300 dark:border-error-600 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                        <button
                            onClick={onEdit}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Edit2 size={16} />
                            Edit
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReminderDetailsModal; 