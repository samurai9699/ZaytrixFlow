import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Send } from 'lucide-react';
import { generateInvoicePDF } from '../../../utils/pdfGenerator';
import { toast } from 'sonner';
import { formatCurrency, formatDateLong } from '../../../utils/dashboardUtils';

import { Invoice } from '../../../types';
import { isLineItemArray } from '../../../utils/typeGuards';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handleDownloadPDF = async () => {
    try {
      await generateInvoicePDF(invoice);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleSendInvoice = async () => {
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Invoice sent to ${invoice.client_email}`);
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      case 'pending':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'unpaid':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
      case 'upcoming':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const calculateSubtotal = () => {
    if (isLineItemArray(invoice.line_items)) {
      return invoice.line_items.reduce((sum, item) => sum + item.amount, 0);
    }
    return invoice.amount || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxPercentage = invoice.tax_percentage || 0;
    return (subtotal * taxPercentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Preview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.invoice_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleDownloadPDF}
                className="p-2 rounded-lg bg-success-50 dark:bg-success-900/30 text-success-600 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download PDF"
              >
                <Download size={20} />
              </motion.button>
              <motion.button
                onClick={handleSendInvoice}
                className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-900/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Send Invoice"
              >
                <Send size={20} />
              </motion.button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h1>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p className="font-medium">{invoice.invoice_number}</p>
                    <p>Issue Date: {formatDateLong(invoice.issue_date)}</p>
                    <p>Due Date: {formatDateLong(invoice.due_date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      ZaytrixFlow
                    </p>
                    <p>Invoice Management</p>
                    <p>support@zaytrixflow.com</p>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bill To:</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.client_name}</p>
                  <p>{invoice.client_email}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-gray-600 dark:text-gray-300 font-medium">Description</th>
                      <th className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium">Qty</th>
                      <th className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium">Rate</th>
                      <th className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLineItemArray(invoice.line_items) ? (
                      invoice.line_items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-4 text-gray-900 dark:text-white">{item.description}</td>
                          <td className="py-4 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                          <td className="py-4 text-right text-gray-700 dark:text-gray-300">
                            {formatCurrency(item.rate, invoice.currency)}
                          </td>
                          <td className="py-4 text-right text-gray-900 dark:text-white font-medium">
                            {formatCurrency(item.amount, invoice.currency)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-4 text-gray-900 dark:text-white">
                          {invoice.description || 'Service'}
                        </td>
                        <td className="py-4 text-right text-gray-700 dark:text-gray-300">1</td>
                        <td className="py-4 text-right text-gray-700 dark:text-gray-300">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </td>
                        <td className="py-4 text-right text-gray-900 dark:text-white font-medium">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(calculateSubtotal(), invoice.currency)}
                    </span>
                  </div>
                  {(invoice.tax_percentage || 0) > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300">
                        Tax ({invoice.tax_percentage || 0}%):
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(calculateTax(), invoice.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(calculateTotal(), invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes:</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {invoice.description}
                  </p>
                </div>
              )}

              {/* Payment Instructions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Instructions:</h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-1">
                  <p>Please make payment within the specified due date.</p>
                  <p>For any questions regarding this invoice, please contact us at support@zaytrixflow.com</p>
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoicePreviewModal;
