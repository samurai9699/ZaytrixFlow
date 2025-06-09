import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../constants';
import Navbar from '../Navbar';
import Footer from '../Footer';

const TestimonialsPage: React.FC = () => {
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
                            Client Success Stories
                        </motion.h1>
                        <motion.p
                            className="text-xl text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Discover how freelancers are transforming their payment processes with ZaytrixFlow
                        </motion.p>
                    </div>

                    <div className="space-y-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                            >
                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary-100 dark:text-primary-900/30" />
                                    <div className="pl-8">
                                        <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-6">
                                            "{testimonial.quote}"
                                        </p>
                                        <div className="flex items-center">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white dark:border-gray-700 shadow-sm"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                                                    {testimonial.name}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {testimonial.role}, {testimonial.company}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Join Them?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Start streamlining your payment process today and join thousands of satisfied freelancers.
                        </p>
                        <motion.a
                            href="/#pricing"
                            className="inline-flex px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.a>
                    </motion.div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default TestimonialsPage; 