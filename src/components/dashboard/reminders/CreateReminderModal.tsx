import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: string;
  invoice_id?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  due_date: string;
  status: string;
}

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  due_date: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  invoice_id: z.string().optional(),
});

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editReminder?: Reminder | null;
}

const CreateReminderModal: React.FC<CreateReminderModalProps> = ({ isOpen, onClose, onSuccess, editReminder }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchInvoices();

      if (editReminder) {
        // Populate form with existing reminder data
        setTitle(editReminder.title);
        setDueDate(editReminder.due_date.split('T')[0]);
        setNotes(editReminder.description || '');
        setSelectedInvoiceId(editReminder.invoice_id || '');
      } else {
        // Set default due date to tomorrow for new reminders
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDueDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, user, editReminder]);

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, client_name, amount, due_date, status')
        .eq('user_id', user.id)
        .in('status', ['unpaid', 'pending', 'upcoming'])
        .order('due_date', { ascending: true });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const validateForm = () => {
    try {
      reminderSchema.parse({
        title: title.trim(),
        due_date: dueDate,
        notes: notes.trim() || undefined,
        invoice_id: selectedInvoiceId || undefined,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create a reminder');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (editReminder) {
        // Update existing reminder
        const { error } = await supabase
          .from('reminders')
          .update({
            title: title.trim(),
            description: notes.trim() || null,
            due_date: dueDate,
            invoice_id: selectedInvoiceId || null,
          })
          .eq('id', editReminder.id)
          .eq('user_id', user.id);

        if (error) throw error;

        toast.success('Reminder updated successfully!');
      } else {
        // Create new reminder
        const { error } = await supabase
          .from('reminders')
          .insert({
            user_id: user.id,
            title: title.trim(),
            description: notes.trim() || null,
            due_date: dueDate,
            invoice_id: selectedInvoiceId || null,
            status: 'pending',
          });

        if (error) throw error;

        toast.success('Reminder created successfully!');
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error(`Failed to ${editReminder ? 'update' : 'create'} reminder. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setNotes('');
    setSelectedInvoiceId('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen) return null;

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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editReminder ? 'Edit Reminder' : 'Create Reminder'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editReminder ? 'Update reminder details' : 'Set up a new payment reminder'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                  placeholder="Enter reminder title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                />
                {errors.due_date && (
                  <p className="mt-1 text-sm text-error-500">{errors.due_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link to Invoice (Optional)
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                >
                  <option value="">Select an invoice...</option>
                  {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.client_name} - {formatCurrency(invoice.amount)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                  placeholder="Additional notes for this reminder..."
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {editReminder ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editReminder ? 'Update Reminder' : 'Create Reminder'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateReminderModal;