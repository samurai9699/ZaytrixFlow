import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';
import ScrollToTop from './utils/ScrollToTop';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CheckoutPage from './components/checkout/CheckoutPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import InvoiceList from './components/dashboard/invoices/InvoiceList';
import ProtectedRoute from './components/auth/ProtectedRoute';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Stats />
    <Features />
    <Pricing />
    <Testimonials />
    <WaitlistForm />
    <Footer />
  </>
);

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.title = "InvoiceFlow | Get Paid On Time, Every Time";
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen">
          <Toaster position="top-right" />
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 z-50 origin-left"
            style={{ scaleX }}
          />
          
          <ScrollToTop />
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/checkout/:planId" element={<CheckoutPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardOverview />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/invoices" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InvoiceList />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clients" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Clients</h1>
                    <p>Client management coming soon!</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Settings</h1>
                    <p>Settings configuration coming soon!</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;