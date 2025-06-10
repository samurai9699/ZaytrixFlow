import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ExternalLink } from 'lucide-react';
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
  const handlePostClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-gray-900">
      <Navbar />
      
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
              className="text-xl text-gray-600 dark:text-gray-300"
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
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-gray-800/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                onClick={() => handlePostClick(post.url)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg">
                      <ExternalLink className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {post.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {post.summary}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                        Read Full Article
                      </span>
                      <ExternalLink className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300" />
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
            className="text-center mt-16"
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Want more insights?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Stay updated with the latest tips and strategies for freelance success
              </p>
              <motion.button
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe to Newsletter
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;