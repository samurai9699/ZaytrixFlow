import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoice: any;
  loading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  invoice,
  loading
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-error-50 dark:bg-error-900/30">
                <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Invoice</h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete invoice <strong>{invoice.invoice_number}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-error-800 dark:text-error-200 mb-1">
                    This will permanently delete:
                  </h4>
                  <ul className="text-sm text-error-700 dark:text-error-300 space-y-1">
                    <li>• Invoice data and line items</li>
                    <li>• Payment history and records</li>
                    <li>• Any associated reminders</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Invoice Details:</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p><span className="font-medium">Client:</span> {invoice.client_name}</p>
                <p><span className="font-medium">Amount:</span> ${invoice.amount?.toFixed(2)}</p>
                <p><span className="font-medium">Status:</span> {invoice.status}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <motion.button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2 bg-error-600 text-white rounded-lg font-medium hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Invoice'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;