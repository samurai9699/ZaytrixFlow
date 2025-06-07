import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Monitor, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../../contexts/ThemeContext';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const THEME_OPTIONS = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface',
    icon: Sun,
    preview: 'bg-white border-gray-200',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes in low light',
    icon: Moon,
    preview: 'bg-gray-900 border-gray-700',
  },
  {
    id: 'system',
    name: 'System',
    description: 'Follows your device settings',
    icon: Monitor,
    preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400',
  },
];

const ThemeSettings: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('system');

  useEffect(() => {
    if (user) {
      fetchThemePreference();
    }
  }, [user]);

  const fetchThemePreference = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('theme')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching theme preference:', error);
        return;
      }

      if (data?.theme) {
        setSelectedTheme(data.theme);
      }
    } catch (error) {
      console.error('Error fetching theme preference:', error);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    
    // Apply theme immediately for preview
    if (themeId === 'light') {
      if (isDarkMode) toggleTheme();
    } else if (themeId === 'dark') {
      if (!isDarkMode) toggleTheme();
    } else {
      // System theme - check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark !== isDarkMode) {
        toggleTheme();
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: selectedTheme,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast.success('Theme preference saved!');
    } catch (error: any) {
      console.error('Error saving theme preference:', error);
      toast.error('Failed to save theme preference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Customize how ZaytrixFlow looks and feels.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Theme Preference
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              return (
                <motion.button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTheme === theme.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-12 rounded-lg border-2 ${theme.preview} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {theme.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {theme.description}
                      </p>
                    </div>
                    {selectedTheme === theme.id && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary-500"
                        layoutId="themeIndicator"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
          <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
            Live Preview
          </h4>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Changes are applied immediately so you can see how they look. Don't forget to save your preference!
          </p>
        </div>

        <div className="pt-4">
          <motion.button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Theme
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;