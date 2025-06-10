import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, ExternalLink, Mail, X, CheckCircle, Loader2 } from 'lucide-react';

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

// Skeleton component for blog post loading
const BlogPostSkeleton = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
    <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 w-full h-64" />
    <div className="p-8">
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4" />
      <div className="space-y-3 mb-8">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4" />
      </div>
      <div className="flex gap-6 mb-6">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-20" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-24" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-16" />
      </div>
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-32" />
      </div>
    </div>
  </div>
);

// Image component with loading state
const BlogPostImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mx-auto mb-2" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
      
      <img 
        src={src} 
        alt={alt}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-colors duration-300" />
    </div>
  );
};

const BlogPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState([]);

  // Simulate content loading with staggered appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Stagger the appearance of blog posts
    BLOG_POSTS.forEach((post, index) => {
      setTimeout(() => {
        setVisiblePosts(prev => [...prev, post]);
      }, 1000 + (index * 200));
    });

    return () => clearTimeout(timer);
  }, []);

  const handlePostClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = () => {
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
    
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-gray-900 dark:to-indigo-950 transition-colors duration-500">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-gray-900 dark:to-indigo-950 z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Loading amazing content...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              ZaytrixFlow Blog
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Insights and tips for better freelance payment management
            </motion.p>
          </div>

          <div className="space-y-12">
            {/* Show skeletons while loading */}
            {isLoading && (
              <>
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <BlogPostSkeleton />
                  </motion.div>
                ))}
              </>
            )}

            {/* Show actual posts as they become visible */}
            {visiblePosts.map((post, index) => (
              <motion.article
                key={index}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                onClick={() => handlePostClick(post.url)}
              >
                <BlogPostImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full p-3 shadow-lg border border-white/20">
                    <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
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
                      <span className="text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        Read Full Article
                      </span>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-300 transform group-hover:translate-x-1">
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
            transition={{ delay: 2.5, duration: 0.8 }}
            className="text-center mt-20"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-blue-700/50 shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Stay in the Loop
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  Get the latest freelance tips, payment strategies, and industry insights delivered straight to your inbox
                </p>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full px-6 py-4 rounded-xl border ${
                        emailError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-lg`}
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-500 text-left">{emailError}</p>
                    )}
                  </div>
                  
                  <motion.button
                    onClick={handleNewsletterSubmit}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe to Newsletter
                  </motion.button>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPage;