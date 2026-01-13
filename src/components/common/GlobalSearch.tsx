import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, User, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/debounce';

interface SearchResult {
  type: 'invoice' | 'client';
  id: string;
  title: string;
  subtitle: string;
  metadata?: string;
}

const GlobalSearch: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim() || !user) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const searchTerm = `%${searchQuery.toLowerCase()}%`;

        const [invoicesResponse, clientsResponse] = await Promise.all([
          supabase
            .from('invoices')
            .select('id, invoice_number, client_name, client_email, amount, currency, status')
            .eq('user_id', user.id)
            .or(`invoice_number.ilike.${searchTerm},client_name.ilike.${searchTerm},client_email.ilike.${searchTerm}`)
            .limit(5),
          supabase
            .from('clients')
            .select('id, name, email, company')
            .eq('user_id', user.id)
            .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm}`)
            .limit(5),
        ]);

        const searchResults: SearchResult[] = [];

        if (invoicesResponse.data) {
          invoicesResponse.data.forEach((invoice) => {
            searchResults.push({
              type: 'invoice',
              id: invoice.id,
              title: invoice.invoice_number,
              subtitle: invoice.client_name,
              metadata: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)} • ${invoice.status}`,
            });
          });
        }

        if (clientsResponse.data) {
          clientsResponse.data.forEach((client) => {
            searchResults.push({
              type: 'client',
              id: client.id,
              title: client.name,
              subtitle: client.email,
              metadata: client.company || '',
            });
          });
        }

        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [user]
  );

  useEffect(() => {
    if (query) {
      setLoading(true);
      performSearch(query);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results.length > 0) {
          e.preventDefault();
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'invoice') {
      navigate('/dashboard/invoices');
    } else if (result.type === 'client') {
      navigate('/dashboard/clients');
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText size={18} className="text-primary-500" />;
      case 'client':
        return <User size={18} className="text-secondary-500" />;
      default:
        return <TrendingUp size={18} className="text-gray-500" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors w-64"
      >
        <Search size={16} />
        <span>Search...</span>
        <kbd className="ml-auto text-xs text-gray-500 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
                setResults([]);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search invoices, clients..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
                {loading && <Loader2 size={18} className="text-primary-500 animate-spin" />}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    setResults([]);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {query && results.length === 0 && !loading && (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No results found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {result.title}
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                          {result.metadata && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                              {result.metadata}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {!query && (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Start typing to search across invoices and clients
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                        Navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                        Select
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd>
                        Close
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
