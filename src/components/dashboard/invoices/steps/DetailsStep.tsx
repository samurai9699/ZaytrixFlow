import React from 'react';

interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  terms: string;
  notes: string;
}

interface DetailsStepProps {
  data: InvoiceDetails;
  onUpdate: (details: InvoiceDetails) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof InvoiceDetails, value: string | Date) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            value={data.invoiceNumber}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            value={data.issueDate.toISOString().split('T')[0]}
            onChange={(e) => handleChange('issueDate', new Date(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={data.dueDate.toISOString().split('T')[0]}
            onChange={(e) => handleChange('dueDate', new Date(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Terms
          </label>
          <select
            value={data.terms}
            onChange={(e) => handleChange('terms', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
          >
            <option value="">Select terms</option>
            <option value="net7">Net 7</option>
            <option value="net15">Net 15</option>
            <option value="net30">Net 30</option>
            <option value="net60">Net 60</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
          placeholder="Add any additional notes or payment instructions..."
        />
      </div>
    </div>
  );
};

export default DetailsStep;