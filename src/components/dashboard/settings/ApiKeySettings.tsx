import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface ApiKey {
  id: string;
  name: string;
  key_preview: string;
  permissions: string[];
  last_used_at: string | null;
  created_at: string;
  is_active: boolean;
}

const ApiKeySettings: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);

  const PERMISSIONS = [
    { id: 'read', label: 'Read', description: 'View invoices and clients' },
    { id: 'write', label: 'Write', description: 'Create and update data' },
    { id: 'delete', label: 'Delete', description: 'Delete invoices and clients' },
  ];

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'zf_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleCreateKey = async () => {
    if (!user || !newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      setLoading(true);
      const apiKey = generateApiKey();
      const keyHash = await hashApiKey(apiKey);
      const keyPreview = apiKey.substring(0, 8) + '...';

      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKeyName.trim(),
          key_hash: keyHash,
          key_preview: keyPreview,
          permissions: newKeyPermissions,
        });

      if (error) throw error;

      setGeneratedKey(apiKey);
      setShowGeneratedKey(true);
      setNewKeyName('');
      setNewKeyPermissions(['read']);
      setShowCreateForm(false);
      fetchApiKeys();
      toast.success('API key created successfully!');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      fetchApiKeys();
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage API keys for integrating with external applications.
        </p>
      </div>

      {/* Generated Key Display */}
      <AnimatePresence>
        {generatedKey && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-lg bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800"
          >
            <h3 className="font-medium text-success-800 dark:text-success-200 mb-2">
              API Key Generated Successfully!
            </h3>
            <p className="text-sm text-success-700 dark:text-success-300 mb-3">
              Copy this key now - you won't be able to see it again.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-lg border font-mono text-sm">
                {showGeneratedKey ? generatedKey : '•'.repeat(generatedKey.length)}
              </div>
              <button
                onClick={() => setShowGeneratedKey(!showGeneratedKey)}
                className="p-3 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/50 transition-colors"
              >
                {showGeneratedKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => copyToClipboard(generatedKey)}
                className="p-3 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/50 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            <button
              onClick={() => setGeneratedKey(null)}
              className="mt-3 text-sm text-success-700 dark:text-success-300 hover:underline"
            >
              I've copied the key, dismiss this message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Key */}
      <div className="mb-6">
        {!showCreateForm ? (
          <motion.button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            Create New API Key
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Create New API Key
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Mobile App Integration"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {PERMISSIONS.map((permission) => (
                    <label key={permission.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={newKeyPermissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyPermissions([...newKeyPermissions, permission.id]);
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.label}
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {permission.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateKey}
                  disabled={loading || !newKeyName.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Key'
                  )}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Your API Keys
        </h3>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No API keys yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first API key to start integrating with external applications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {apiKey.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apiKey.is_active
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-mono">{apiKey.key_preview}</span>
                      <span>•</span>
                      <span>Created {formatDate(apiKey.created_at)}</span>
                      {apiKey.last_used_at && (
                        <>
                          <span>•</span>
                          <span>Last used {formatDate(apiKey.last_used_at)}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* API Documentation Link */}
      <div className="mt-8 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
        <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
          API Documentation
        </h4>
        <p className="text-sm text-primary-700 dark:text-primary-300 mb-3">
          Learn how to use the ZaytrixFlow API to integrate with your applications.
        </p>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View API Documentation →
        </button>
      </div>
    </div>
  );
};

export default ApiKeySettings;