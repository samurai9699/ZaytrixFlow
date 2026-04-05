import React from 'react';
import { Download, Send } from 'lucide-react';

import type { WizardData } from '../CreateInvoiceWizard';
import type { LineItem } from '../../../../types';

interface PreviewStepProps {
  data: WizardData;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Download size={20} />
          Download PDF
        </button>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors">
          <Send size={20} />
          Send Invoice
        </button>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
        {/* Invoice Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h2>
            <p className="text-gray-500 dark:text-gray-400">#{data.details.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400">Issue Date: {data.details.issueDate.toLocaleDateString()}</p>
            <p className="text-gray-500 dark:text-gray-400">Due Date: {data.details.dueDate.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client Information */}
        {data.client && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
            <p className="text-gray-700 dark:text-gray-300">{data.client.name}</p>
            <p className="text-gray-700 dark:text-gray-300">{data.client.email}</p>
            {data.client.company && (
              <p className="text-gray-700 dark:text-gray-300">{data.client.company}</p>
            )}
          </div>
        )}

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 text-left text-gray-500 dark:text-gray-400">Description</th>
              <th className="py-2 text-right text-gray-500 dark:text-gray-400">Quantity</th>
              <th className="py-2 text-right text-gray-500 dark:text-gray-400">Rate</th>
              <th className="py-2 text-right text-gray-500 dark:text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: LineItem) => (
              <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-4 text-gray-700 dark:text-gray-300">{item.description}</td>
                <td className="py-4 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                <td className="py-4 text-right text-gray-700 dark:text-gray-300">${item.rate.toFixed(2)}</td>
                <td className="py-4 text-right text-gray-700 dark:text-gray-300">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-700 dark:text-gray-300">
                ${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Tax (0%):</span>
              <span className="text-gray-700 dark:text-gray-300">$0.00</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-semibold">
              <span className="text-gray-900 dark:text-white">Total:</span>
              <span className="text-gray-900 dark:text-white">
                ${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.details.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes:</h3>
            <p className="text-gray-700 dark:text-gray-300">{data.details.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewStep;
