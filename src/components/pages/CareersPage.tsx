import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const JOBS = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    description: "We're looking for a talented Frontend Developer to help build beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.",
    requirements: [
      "3+ years of experience with React and TypeScript",
      "Strong understanding of modern web technologies and best practices",
      "Experience with responsive design and CSS-in-JS solutions",
      "Passion for creating beautiful, intuitive user interfaces"
    ],
    // Add application URLs for each job
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=frontend%20developer%20zaytrixflow",
    // Alternative: Direct email application
    // applyEmail: "careers@zaytrixflow.com"
  },
  {
    title: "Customer Support Specialist",
    type: "Full-time",
    location: "Remote",
    description: "Join our customer success team to help freelancers make the most of ZaytrixFlow. You'll be the voice of our company, providing world-class support.",
    requirements: [
      "2+ years of customer support experience",
      "Excellent written and verbal communication skills",
      "Problem-solving mindset and attention to detail",
      "Experience with help desk software and CRM systems"
    ],
    applyUrl: "https://www.indeed.com/jobs?q=customer+support+zaytrixflow",
    // Alternative: Direct email application
    // applyEmail: "careers@zaytrixflow.com"
  }
];

const CareersPage: React.FC = () => {
  // Function to handle job applications
  const handleApply = (job: typeof JOBS[0]) => {
    if (job.applyUrl) {
      // Open external job posting
      window.open(job.applyUrl, '_blank');
    } else if (job.applyEmail) {
      // Open email client with pre-filled subject
      const subject = encodeURIComponent(`Application for ${job.title} Position`);
      const body = encodeURIComponent(`Dear Hiring Team,\n\nI am interested in applying for the ${job.title} position at ZaytrixFlow.\n\nBest regards`);
      window.location.href = `mailto:${job.applyEmail}?subject=${subject}&body=${body}`;
    } else {
      // Fallback: could redirect to a contact form
      alert('Please send your application to careers@zaytrixflow.com');
    }
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
              Join Our Team
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Help us revolutionize freelance payments
            </motion.p>
          </div>

          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Why ZaytrixFlow?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Remote-First",
                  description: "Work from anywhere in the world with our distributed team."
                },
                {
                  title: "Growth Opportunities",
                  description: "Continuous learning and career development support."
                },
                {
                  title: "Competitive Benefits",
                  description: "Comprehensive health coverage and equity packages."
                }
              ].map((benefit, index) => (
                <div key={index} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-8">
            {JOBS.map((job, index) => (
              <motion.div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{job.title}</h2>
                    <div className="flex gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{job.type}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{job.location}</span>
                    </div>
                  </div>
                  <motion.button
                    className="px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApply(job)}
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">{job.description}</p>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, reqIndex) => (
                      <li 
                        key={reqIndex}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;