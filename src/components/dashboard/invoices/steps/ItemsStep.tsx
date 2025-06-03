import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ItemsStepProps {
  data: InvoiceItem[];
  onUpdate: (items: InvoiceItem[]) => void;
}

const ItemsStep: React.FC<ItemsStepProps> = ({ data, onUpdate }) => {
  const [items, setItems] = useState<InvoiceItem[]>(data || []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      amount: field === 'quantity' || field === 'rate'
        ? Number(value) * (field === 'quantity' ? items[index].rate : items[index].quantity)
        : items[index].amount,
    };
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="w-8"></th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Quantity
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Rate
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-2 py-4">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <GripVertical size={16} />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full bg-transparent border-0 focus:ring-0"
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    className="w-20 text-right bg-transparent border-0 focus:ring-0"
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                    className="w-24 text-right bg-transparent border-0 focus:ring-0"
                  />
                </td>
                <td className="px-4 py-4 text-right">
                  {item.amount.toFixed(2)}
                </td>
                <td className="px-2 py-4">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-error-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addItem}
        className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Plus size={20} />
        Add Item
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-end text-lg font-medium">
          <span className="text-gray-500 dark:text-gray-400 mr-4">Total:</span>
          <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemsStep;