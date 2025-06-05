import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';
import ScrollToTop from './utils/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const LoginForm = React.lazy(() => import('./components/auth/LoginForm'));
const RegisterForm = React.lazy(() => import('./components/auth/RegisterForm'));
const CheckoutPage = React.lazy(() => import('./components/checkout/CheckoutPage'));
const DashboardLayout = React.lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardOverview = React.lazy(() => import('./components/dashboard/DashboardOverview'));
const InvoiceList = React.lazy(() => import('./components/dashboard/invoices/InvoiceList'));
const ProtectedRoute = React.lazy(() => import('./components/auth/ProtectedRoute'));

// Lazy load footer pages
const AboutPage = React.lazy(() => import('./components/pages/AboutPage'));
const BlogPage = React.lazy(() => import('./components/pages/BlogPage'));
const RoadmapPage = React.lazy(() => import('./components/pages/RoadmapPage'));
const IntegrationsPage = React.lazy(() => import('./components/pages/IntegrationsPage'));
const CareersPage = React.lazy(() => import('./components/pages/CareersPage'));
const HelpCenterPage = React.lazy(() => import('./components/pages/HelpCenterPage'));
const ContactPage = React.lazy(() => import('./components/pages/ContactPage'));
const PrivacyPolicyPage = React.lazy(() => import('./components/pages/PrivacyPolicyPage'));
const TermsPage = React.lazy(() => import('./components/pages/TermsPage'));

const LandingPage = () => (
  <>
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
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen">
          <Toaster position="top-right" />
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 z-50 origin-left"
          />
          
          <ScrollToTop />
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              <Suspense fallback={<LoadingSpinner />}>
                <LoginForm />
              </Suspense>
            } />
            <Route path="/register" element={
              <Suspense fallback={<LoadingSpinner />}>
                <RegisterForm />
              </Suspense>
            } />
            <Route path="/checkout/:planId" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CheckoutPage />
              </Suspense>
            } />
            
            {/* Footer Pages */}
            <Route path="/about" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AboutPage />
              </Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<LoadingSpinner />}>
                <BlogPage />
              </Suspense>
            } />
            <Route path="/roadmap" element={
              <Suspense fallback={<LoadingSpinner />}>
                <RoadmapPage />
              </Suspense>
            } />
            <Route path="/integrations" element={
              <Suspense fallback={<LoadingSpinner />}>
                <IntegrationsPage />
              </Suspense>
            } />
            <Route path="/careers" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CareersPage />
              </Suspense>
            } />
            <Route path="/help" element={
              <Suspense fallback={<LoadingSpinner />}>
                <HelpCenterPage />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ContactPage />
              </Suspense>
            } />
            <Route path="/privacy" element={
              <Suspense fallback={<LoadingSpinner />}>
                <PrivacyPolicyPage />
              </Suspense>
            } />
            <Route path="/terms" element={
              <Suspense fallback={<LoadingSpinner />}>
                <TermsPage />
              </Suspense>
            } />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardOverview />
                  </DashboardLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/dashboard/invoices" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardLayout>
                    <InvoiceList />
                  </DashboardLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;