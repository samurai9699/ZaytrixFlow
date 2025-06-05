import React from 'react';
import { motion } from 'framer-motion';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  className = '',
  animate = true 
}) => {
  const baseClasses = "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg";

  if (!animate) {
    return (
      <div className={`${baseClasses} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassContainer;