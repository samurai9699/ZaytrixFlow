import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  FileText, 
  Mail, 
  Phone, 
  Building,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import CreateClientModal from './CreateClientModal';
import EditClientModal from './EditClientModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ClientInvoicesModal from './ClientInvoicesModal';

interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  total_invoices?: number;
  total_amount?: number;
  last_invoice_date?: string;
}

const ClientList: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'total_amount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (user) {
      fetchClients();
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('clients_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'clients',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            fetchClients();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    filterAndSortClients();
  }, [clients, searchQuery, sortBy, sortOrder]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch clients with invoice statistics
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Fetch invoice statistics for each client
      const clientsWithStats = await Promise.all(
        (clientsData || []).map(async (client) => {
          const { data: invoiceStats, error: statsError } = await supabase
            .from('invoices')
            .select('amount, created_at')
            .eq('user_id', user.id)
            .eq('client_id', client.id);

          if (statsError) {
            console.error('Error fetching invoice stats:', statsError);
            return {
              ...client,
              total_invoices: 0,
              total_amount: 0,
              last_invoice_date: null
            };
          }

          const totalInvoices = invoiceStats?.length || 0;
          const totalAmount = invoiceStats?.reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0) || 0;
          const lastInvoiceDate = invoiceStats?.length > 0 
            ? invoiceStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
            : null;

          return {
            ...client,
            total_invoices: totalInvoices,
            total_amount: totalAmount,
            last_invoice_date: lastInvoiceDate
          };
        })
      );

      setClients(clientsWithStats);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortClients = () => {
    let filtered = [...clients];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'total_amount':
          aValue = a.total_amount || 0;
          bValue = b.total_amount || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredClients(filtered);
  };

  const handleDeleteClient = async (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClient.id);

      if (error) throw error;

      toast.success('Client deleted successfully');
      setShowDeleteModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleViewInvoices = (client: Client) => {
    setSelectedClient(client);
    setShowInvoicesModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your client relationships ({filteredClients.length} total)
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          Add Client
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'created_at' | 'total_amount');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="total_amount-desc">Highest Value</option>
              <option value="total_amount-asc">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Grid */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Add your first client to get started'
              }
            </p>
            {!searchQuery && (
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Your First Client
              </motion.button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredClients.map((client) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                          <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {client.name}
                          </h3>
                          {client.company && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {client.company}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => handleViewInvoices(client)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <FileText size={16} />
                            View Invoices
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Edit3 size={16} />
                            Edit Client
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client)}
                            className="w-full px-4 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete Client
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail size={16} />
                        <span className="truncate">{client.email}</span>
                      </div>
                      
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone size={16} />
                          <span>{client.phone}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Total Invoices</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {client.total_invoices || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(client.total_amount || 0)}
                            </p>
                          </div>
                        </div>
                        
                        {client.last_invoice_date && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={14} />
                            <span>Last invoice: {formatDate(client.last_invoice_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateClientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchClients();
        }}
      />

      <EditClientModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedClient(null);
          fetchClients();
        }}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedClient(null);
        }}
        onConfirm={confirmDelete}
        client={selectedClient}
        loading={false}
      />

      <ClientInvoicesModal
        isOpen={showInvoicesModal}
        onClose={() => {
          setShowInvoicesModal(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
    </div>
  );
};

export default ClientList;