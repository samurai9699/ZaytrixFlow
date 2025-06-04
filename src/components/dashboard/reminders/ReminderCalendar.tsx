import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReminderCalendar: React.FC = () => {
  // This is a placeholder component - we'll integrate with FullCalendar later
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">March 2025</h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Month
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Week
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Day
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Calendar grid placeholder */}
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-gray-200 dark:border-gray-700 rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReminderCalendar;