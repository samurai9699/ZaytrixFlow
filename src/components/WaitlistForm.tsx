import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, this would send the email to a backend
    console.log('Email submitted:', email);
    setSubmitted(true);
    setError('');
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-gradient-to-br from-primary-900 to-secondary-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-20 bg-[linear-gradient(to_right,#6366f180,#3b82f680,#6366f180)] blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-full h-20 bg-[linear-gradient(to_right,#6366f180,#3b82f680,#6366f180)] blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Be the First to Experience InvoiceFlow
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join our waitlist for early access and special launch pricing
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Join Now
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
                {error && (
                  <p className="text-error-300 text-sm mt-2">{error}</p>
                )}
                <p className="text-sm text-white/60 mt-3">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            ) : (
              <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center text-success-400 mb-4">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                <p className="text-white/80">
                  Thank you for joining our waitlist. We'll notify you as soon as InvoiceFlow is ready for you.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;