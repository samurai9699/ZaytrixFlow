import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MoreVertical, Download, Send, Trash2 } from 'lucide-react';
import CreateInvoiceWizard from './CreateInvoiceWizard';

const MOCK_INVOICES = [
  {
    id: 'INV-001',
    client: 'John Doe',
    amount: 1250.00,
    date: '2025-03-01',
    dueDate: '2025-03-15',
    status: 'paid',
  },
  {
    id: 'INV-002',
    client: 'Jane Smith',
    amount: 850.00,
    date: '2025-03-05',
    dueDate: '2025-03-20',
    status: 'pending',
  },
  {
    id: 'INV-003',
    client: 'Bob Johnson',
    amount: 2100.00,
    date: '2025-02-28',
    dueDate: '2025-03-14',
    status: 'overdue',
  },
];

const InvoiceList: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      case 'pending':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'overdue':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track your invoices</p>
        </div>
        <CreateInvoiceWizard />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Client
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((invoice) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {invoice.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {invoice.client}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-white font-medium">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Download size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Send size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-error-500">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;