import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, User, Calendar, DollarSign, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const invoiceSchema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  client_email: z.string().email('Valid email is required'),
  invoice_number: z.string().min(1, 'Invoice number is required'),
  due_date: z.string().min(1, 'Due date is required'),
  line_items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
    rate: z.number().min(0, 'Rate must be non-negative'),
  })).min(1, 'At least one line item is required'),
  tax_percentage: z.number().min(0).max(100),
});

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  // Clients for dropdown
  const [clients, setClients] = useState<Client[]>([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateInvoiceNumber();
      fetchClients();
      // Set default due date to 30 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setDueDate(defaultDueDate.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${year}${month}-${random}`);
  };

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        // Use mock data as fallback
        const mockClients: Client[] = [
          { id: '1', name: 'Acme Corporation', email: 'billing@acme.com', company: 'Acme Corp' },
          { id: '2', name: 'TechStart Inc', email: 'finance@techstart.com', company: 'TechStart' },
          { id: '3', name: 'Design Studio', email: 'accounts@designstudio.com', company: 'Design Studio' },
        ];
        setClients(mockClients);
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Use mock data as fallback
      const mockClients: Client[] = [
        { id: '1', name: 'Acme Corporation', email: 'billing@acme.com', company: 'Acme Corp' },
        { id: '2', name: 'TechStart Inc', email: 'finance@techstart.com', company: 'TechStart' },
        { id: '3', name: 'Design Studio', email: 'accounts@designstudio.com', company: 'Design Studio' },
      ];
      setClients(mockClients);
    }
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxPercentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validateForm = () => {
    try {
      // Clear previous errors
      setErrors({});

      // Validate line items have valid data
      const validLineItems = lineItems.filter(item => 
        item.description.trim() !== '' && 
        item.quantity > 0 && 
        item.rate >= 0
      );

      if (validLineItems.length === 0) {
        setErrors({ line_items: 'At least one valid line item is required' });
        return false;
      }

      const formData = {
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        invoice_number: invoiceNumber.trim(),
        due_date: dueDate,
        line_items: validLineItems.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity,
          rate: item.rate,
        })),
        tax_percentage: taxPercentage,
      };

      invoiceSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        
        // Show first error in toast
        const firstError = Object.values(newErrors)[0];
        if (firstError) {
          toast.error(firstError);
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create an invoice');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare line items data
      const validLineItems = lineItems.filter(item => 
        item.description.trim() !== '' && 
        item.quantity > 0 && 
        item.rate >= 0
      );

      const invoiceData = {
        user_id: user.id,
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        invoice_number: invoiceNumber.trim(),
        amount: calculateTotal(),
        currency: 'USD',
        status: 'upcoming' as const,
        issue_date: issueDate,
        due_date: dueDate,
        description: description.trim() || null,
        line_items: validLineItems,
        tax_percentage: taxPercentage,
      };

      console.log('Creating invoice with data:', invoiceData);

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Invoice created successfully:', data);
      toast.success('Invoice created successfully!');
      resetForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      
      if (error.code === '23505') {
        toast.error('Invoice number already exists. Please use a different number.');
        setErrors({ invoice_number: 'Invoice number already exists' });
      } else if (error.message?.includes('line_items')) {
        toast.error('Error saving line items. Please check your data and try again.');
      } else {
        toast.error('Failed to create invoice. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setInvoiceNumber('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setDescription('');
    setTaxPercentage(0);
    setLineItems([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
    setShowNewClientForm(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectClient = (client: Client) => {
    setClientName(client.name);
    setClientEmail(client.email);
    setShowNewClientForm(false);
  };

  if (!isOpen) return null;

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Client
                  </label>
                  {!showNewClientForm ? (
                    <div className="space-y-2">
                      {clients.map(client => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => selectClient(client)}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            clientName === client.name
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowNewClientForm(true)}
                        className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add New Client
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Client Name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                        />
                        {errors.client_name && (
                          <p className="mt-1 text-sm text-error-500">{errors.client_name}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Client Email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                        />
                        {errors.client_email && (
                          <p className="mt-1 text-sm text-error-500">{errors.client_email}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewClientForm(false)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        ← Back to client list
                      </button>
                    </div>
                  )}
                </div>

                {/* Invoice Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                    />
                    {errors.invoice_number && (
                      <p className="mt-1 text-sm text-error-500">{errors.invoice_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                    />
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
                </div>
              </div>

              {/* Line Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Line Items
                </label>
                {errors.line_items && (
                  <p className="mb-4 text-sm text-error-500">{errors.line_items}</p>
                )}
                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="col-span-12 md:col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                        />
                        {errors[`line_items.${index}.description`] && (
                          <p className="mt-1 text-sm text-error-500">{errors[`line_items.${index}.description`]}</p>
                        )}
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          placeholder="Rate"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg text-right font-medium">
                          ${item.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                          className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Line Item
                  </button>
                </div>
              </div>

              {/* Tax and Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tax ({taxPercentage}%):</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                  placeholder="Add any additional notes or payment instructions..."
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
                  Creating...
                </>
              ) : (
                'Create Invoice'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateInvoiceModal;