import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Bell, Settings } from 'lucide-react';
import ReminderCalendar from './ReminderCalendar';
import ReminderTimeline from './ReminderTimeline';
import TemplateEditor from './TemplateEditor';
import ReminderMetrics from './ReminderMetrics';
import CreateReminderModal from './CreateReminderModal';

const ReminderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'templates' | 'settings'>('calendar');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    // Refresh the reminders data if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reminder Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Schedule and manage your payment reminders</p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell size={20} />
            Create Reminder
          </motion.button>
        </div>
      </div>

      {/* Metrics Overview */}
      <ReminderMetrics />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 text-sm font-medium ${
              activeTab === 'calendar'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Calendar size={20} />
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 text-sm font-medium ${
              activeTab === 'templates'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Clock size={20} />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 text-sm font-medium ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <ReminderCalendar />
            <ReminderTimeline />
          </div>
        )}
        
        {activeTab === 'templates' && (
          <TemplateEditor />
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reminder Settings</h2>
            <p className="text-gray-600 dark:text-gray-300">Configure your reminder preferences and notification settings.</p>
          </div>
        )}
      </div>

      {/* Create Reminder Modal */}
      <CreateReminderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default ReminderDashboard;