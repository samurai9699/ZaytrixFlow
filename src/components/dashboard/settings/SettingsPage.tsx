import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Key, Shield, Puzzle, CreditCard } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import ThemeSettings from './ThemeSettings';
import ApiKeySettings from './ApiKeySettings';
import SecuritySettings from './SecuritySettings';
import IntegrationsSettings from './IntegrationsSettings';
import SubscriptionSettings from './SubscriptionSettings';

const SETTINGS_TABS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    component: ProfileSettings,
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: CreditCard,
    component: SubscriptionSettings,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    component: NotificationSettings,
  },
  {
    id: 'theme',
    label: 'Appearance',
    icon: Palette,
    component: ThemeSettings,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Puzzle,
    component: IntegrationsSettings,
  },
  {
    id: 'api',
    label: 'API Keys',
    icon: Key,
    component: ApiKeySettings,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    component: SecuritySettings,
  },
];

const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && SETTINGS_TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const ActiveComponent = SETTINGS_TABS.find(tab => tab.id === activeTab)?.component || ProfileSettings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-primary-500"
                        layoutId="activeIndicator"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <ActiveComponent />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;