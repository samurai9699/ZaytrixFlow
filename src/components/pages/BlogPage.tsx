import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, ExternalLink, Mail, X, CheckCircle } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const BLOG_POSTS = [
  {
    title: "Top 5 Invoice Tips for Freelancers in 2025",
    summary: "Learn the latest best practices for creating professional invoices that get you paid faster. From automation to psychology, these tips will transform your billing process.",
    author: "Sarah Johnson",
    date: "March 15, 2025",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1280",
    url: "https://www.hellobonsai.com/blog/how-to-write-an-invoice-for-freelance-work"
  },
  {
    title: "How to Automate Your Payment Collection Process",
    summary: "Discover how automation can reduce late payments by up to 75% while maintaining great client relationships. A step-by-step guide to setting up your payment automation system.",
    author: "Marcus Chen",
    date: "March 10, 2025",
    readTime: "7 min read",
    image: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1280",
    url: "https://www.ignitionapp.com/blog/automated-payment-collection"
  },
  {
    title: "The Future of Freelance Payments: AI and Blockchain",
    summary: "Explore how emerging technologies are reshaping the future of freelance payments. From AI-powered payment predictions to blockchain-based smart contracts.",
    author: "Alex Rivera",
    date: "March 5, 2025",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/8353841/pexels-photo-8353841.jpeg?auto=compress&cs=tinysrgb&w=1280",
    url: "https://medium.com/@mr.cip/blockchain-and-the-future-of-freelance-work-81bc4db89c67"
  }
];

const BlogPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handlePostClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setShowSuccessPopup(true);
    setEmail('');
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Successfully Subscribed!
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Welcome to our newsletter! Get ready for amazing insights and tips delivered straight to your inbox. Happy reading! 📚
                </p>
                
                <button
                  onClick={closeSuccessPopup}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Continue Reading
                </button>
              </div>
              
              <button
                onClick={closeSuccessPopup}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ZaytrixFlow Blog
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Insights and tips for better freelance payment management
            </motion.p>
          </div>

          <div className="space-y-12">
            {BLOG_POSTS.map((post, index) => (
              <motion.article
                key={index}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1) }}
                onClick={() => handlePostClick(post.url)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-colors duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full p-3 shadow-lg border border-white/20">
                      <ExternalLink className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight">
                      {post.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                    {post.summary}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                        Read Full Article
                      </span>
                      <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-all duration-300 transform group-hover:translate-x-1">
                        <span className="text-sm font-medium">Continue Reading</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-20"
          >
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 backdrop-blur-xl rounded-3xl p-12 border border-primary-200/50 dark:border-primary-700/50 shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-6">
                  <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Stay in the Loop
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  Get the latest freelance tips, payment strategies, and industry insights delivered straight to your inbox
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full px-6 py-4 rounded-xl border ${
                        emailError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-lg`}
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-500 text-left">{emailError}</p>
                    )}
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe to Newsletter
                  </motion.button>
                </form>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;