import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  MoreVertical, 
  Download, 
  Send, 
  Trash2, 
  Edit3, 
  Plus,
  Filter,
  Search,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import CreateInvoiceModal from './CreateInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';
import InvoicePreviewModal from './InvoicePreviewModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { generateInvoicePDF } from '../../../utils/pdfGenerator';
import { sendInvoiceEmail } from '../../../services/emailService';
import FilterPresets from '../../common/FilterPresets';

import type { Invoice, LineItem } from '../../../types';

const InvoiceList: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'client'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchInvoices();
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('invoices_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'invoices',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Real-time update:', payload);
            fetchInvoices();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    filterAndSortInvoices();
  }, [invoices, searchQuery, statusFilter, sortBy, sortOrder]);

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortInvoices = () => {
    let filtered = [...invoices];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.due_date);
          bValue = new Date(b.due_date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'client':
          aValue = a.client_name.toLowerCase();
          bValue = b.client_name.toLowerCase();
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInvoices(filtered);
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;

    try {
      setActionLoading('delete');
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      toast.success('Invoice deleted successfully');
      setShowDeleteModal(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      setActionLoading(`pdf-${invoice.id}`);
      await generateInvoicePDF(invoice);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    if (!user) return;

    try {
      setActionLoading(`send-${invoice.id}`);
      const result = await sendInvoiceEmail(invoice, user.id, false);

      if (result.success) {
        toast.success(`Invoice sent to ${invoice.client_email}`);
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error: Error | unknown) {
      console.error('Error sending invoice:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send invoice');
    } finally {
      setActionLoading(null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-success-600 dark:text-success-400" />;
      case 'pending':
        return <Clock size={16} className="text-warning-600 dark:text-warning-400" />;
      case 'unpaid':
        return <AlertCircle size={16} className="text-error-600 dark:text-error-400" />;
      case 'upcoming':
        return <Calendar size={16} className="text-primary-600 dark:text-primary-400" />;
      default:
        return <FileText size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (invoice: Invoice) => {
    if (invoice.status === 'paid') return false;
    return new Date(invoice.due_date) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track your invoices ({filteredInvoices.length} total)
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          New Invoice
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <FilterPresets
            type="invoices"
            currentFilters={{ searchQuery, statusFilter, sortBy, sortOrder }}
            onLoadPreset={(filters) => {
              setSearchQuery((filters.searchQuery as string) || '');
              setStatusFilter((filters.statusFilter as string) || 'all');
              setSortBy((filters.sortBy as 'date' | 'amount' | 'client') || 'date');
              setSortOrder((filters.sortOrder as 'asc' | 'desc') || 'desc');
            }}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search invoices, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'date' | 'amount' | 'client');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="client-asc">Client A-Z</option>
              <option value="client-desc">Client Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first invoice to get started'
              }
            </p>
            {(!searchQuery && statusFilter === 'all') && (
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Your First Invoice
              </motion.button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
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
                <AnimatePresence>
                  {filteredInvoices.map((invoice) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                            <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {invoice.invoice_number}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(invoice.issue_date)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {invoice.client_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.client_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${
                            isOverdue(invoice) 
                              ? 'text-error-600 dark:text-error-400 font-medium' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {formatDate(invoice.due_date)}
                            {isOverdue(invoice) && (
                              <span className="ml-1 text-xs">(Overdue)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => handlePreviewInvoice(invoice)}
                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Preview"
                          >
                            <Eye size={16} />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDownloadPDF(invoice)}
                            disabled={actionLoading === `pdf-${invoice.id}`}
                            className="p-2 text-gray-400 hover:text-success-600 dark:hover:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/30 rounded-lg transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleSendInvoice(invoice)}
                            disabled={actionLoading === `send-${invoice.id}`}
                            className="p-2 text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 rounded-lg transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Send Invoice"
                          >
                            <Send size={16} />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleEditInvoice(invoice)}
                            className="p-2 text-gray-400 hover:text-warning-600 dark:hover:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/30 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="p-2 text-gray-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchInvoices();
        }}
      />

      <EditInvoiceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedInvoice(null);
          fetchInvoices();
        }}
      />

      <InvoicePreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedInvoice(null);
        }}
        onConfirm={confirmDelete}
        invoice={selectedInvoice}
        loading={actionLoading === 'delete'}
      />
    </div>
  );
};

export default InvoiceList;
