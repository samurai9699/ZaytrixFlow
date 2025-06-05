import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const BLOG_POSTS = [
  {
    title: "Top 5 Invoice Tips for Freelancers in 2025",
    summary: "Learn the latest best practices for creating professional invoices that get you paid faster. From automation to psychology, these tips will transform your billing process.",
    author: "Sarah Johnson",
    date: "March 15, 2025",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1280"
  },
  {
    title: "How to Automate Your Payment Collection Process",
    summary: "Discover how automation can reduce late payments by up to 75% while maintaining great client relationships. A step-by-step guide to setting up your payment automation system.",
    author: "Marcus Chen",
    date: "March 10, 2025",
    readTime: "7 min read",
    image: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1280"
  },
  {
    title: "The Future of Freelance Payments: AI and Blockchain",
    summary: "Explore how emerging technologies are reshaping the future of freelance payments. From AI-powered payment predictions to blockchain-based smart contracts.",
    author: "Alex Rivera",
    date: "March 5, 2025",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/8353841/pexels-photo-8353841.jpeg?auto=compress&cs=tinysrgb&w=1280"
  }
];

const BlogPage: React.FC = () => {
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
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;