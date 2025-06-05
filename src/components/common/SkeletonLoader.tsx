import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type: 'text' | 'title' | 'image' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, width, height, className = '' }) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative";
  
  const getDefaultDimensions = () => {
    switch (type) {
      case 'title':
        return { width: '100%', height: '2rem' };
      case 'text':
        return { width: '100%', height: '1rem' };
      case 'image':
        return { width: '100%', height: '200px' };
      case 'button':
        return { width: '120px', height: '40px' };
      default:
        return { width: '100%', height: '1rem' };
    }
  };

  const dimensions = {
    width: width || getDefaultDimensions().width,
    height: height || getDefaultDimensions().height,
  };

  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={dimensions}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default SkeletonLoader;