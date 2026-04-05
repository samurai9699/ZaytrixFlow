import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Star, X, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FilterPreset {
  id: string;
  name: string;
  type: 'invoices' | 'clients';
  filters: Record<string, unknown>;
  is_default: boolean;
}

interface FilterPresetsProps {
  type: 'invoices' | 'clients';
  currentFilters: Record<string, unknown>;
  onLoadPreset: (filters: Record<string, unknown>) => void;
}

const FilterPresets: React.FC<FilterPresetsProps> = ({ type, currentFilters, onLoadPreset }) => {
  const { user } = useAuth();
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPresets();
    }
  }, [user, type]);

  const fetchPresets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('filter_presets')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;

      setPresets(data || []);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };

  const savePreset = async () => {
    if (!user || !newPresetName.trim()) {
      toast.error('Please enter a name for the preset');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('filter_presets').insert({
        user_id: user.id,
        name: newPresetName.trim(),
        type,
        filters: currentFilters,
        is_default: false,
      });

      if (error) throw error;

      toast.success('Filter preset saved');
      setShowSaveModal(false);
      setNewPresetName('');
      fetchPresets();
    } catch (error: Error | unknown) {
      console.error('Error saving preset:', error);
      toast.error('Failed to save preset');
    } finally {
      setLoading(false);
    }
  };

  const setAsDefault = async (id: string) => {
    if (!user) return;

    try {
      await supabase
        .from('filter_presets')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('type', type);

      const { error } = await supabase
        .from('filter_presets')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      toast.success('Default preset updated');
      fetchPresets();
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Failed to set default');
    }
  };

  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase.from('filter_presets').delete().eq('id', id);

      if (error) throw error;

      toast.success('Preset deleted');
      fetchPresets();
    } catch (error) {
      console.error('Error deleting preset:', error);
      toast.error('Failed to delete preset');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
        >
          <Save size={16} />
          Save Filter
        </button>

        {presets.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center gap-1 group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => onLoadPreset(preset.filters)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {preset.is_default && <Star size={14} className="text-warning-500" />}
                  {preset.name}
                </button>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {!preset.is_default && (
                    <button
                      onClick={() => setAsDefault(preset.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Set as default"
                    >
                      <Star size={14} className="text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`Delete preset "${preset.name}"?`)) {
                        deletePreset(preset.id);
                      }
                    }}
                    className="p-2 hover:bg-error-50 dark:hover:bg-error-900/30 hover:text-error-600 dark:hover:text-error-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSaveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowSaveModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Save Filter Preset
                </h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preset Name
                  </label>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="e.g., Overdue Invoices"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        savePreset();
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePreset}
                    disabled={loading || !newPresetName.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Preset'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPresets;

