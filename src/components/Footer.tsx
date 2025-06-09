import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Link to="/" className="inline-block">
                <span className="font-heading font-bold text-2xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-300">
                  ZaytrixFlow
                </span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Helping freelancers get paid on time, every time, without the awkward follow-ups.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://facebook.com/zaytrixflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ y: -3 }}
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="https://twitter.com/zaytrixflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ y: -3 }}
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="https://instagram.com/zaytrixflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ y: -3 }}
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/company/zaytrixflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ y: -3 }}
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="/#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="/#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a></li>
              <li><Link to="/integrations" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Integrations</Link></li>
              <li><Link to="/roadmap" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</Link></li>
              <li><Link to="/testimonials" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            © {currentYear} ZaytrixFlow. All rights reserved.
          </p>
          <div className="flex justify-center sm:justify-end space-x-4">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms</Link>
            <Link to="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;