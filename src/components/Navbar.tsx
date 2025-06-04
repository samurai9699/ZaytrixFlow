import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md'
      : 'bg-transparent'
  }`;

  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.a 
              href="/" 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-300">
                ZaytrixFlow
              </span>
            </motion.a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleDropdownToggle('features')}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors dark:text-gray-200 dark:hover:text-primary-400"
              >
                Features
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'features' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-64 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2"
                  >
                    {NAV_ITEMS.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors dark:text-gray-200 dark:hover:text-primary-400">
              Pricing
            </a>

            <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors dark:text-gray-200 dark:hover:text-primary-400">
              Testimonials
            </a>
            
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium shadow-lg hover:shadow-primary-500/20 transition-all"
            >
              Sign Up
            </Link>
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-3 py-2 rounded-md text-center text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-3 py-2 rounded-md text-center text-white bg-gradient-to-r from-primary-600 to-secondary-500 font-medium hover:opacity-90"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;