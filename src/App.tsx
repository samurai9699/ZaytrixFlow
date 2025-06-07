import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import ScrollToTop from './utils/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';
import PageTransition from './components/common/PageTransition';

// Lazy load components with preload
const preloadComponent = (factory: () => Promise<any>) => {
  const Component = React.lazy(factory);
  Component.preload = factory;
  return Component;
};

// Preload critical components
const Hero = preloadComponent(() => import('./components/Hero'));
const Navbar = preloadComponent(() => import('./components/Navbar'));
const Footer = preloadComponent(() => import('./components/Footer'));

// Lazy load other components
const Stats = React.lazy(() => import('./components/Stats'));
const Features = React.lazy(() => import('./components/Features'));
const Pricing = React.lazy(() => import('./components/Pricing'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const WaitlistForm = React.lazy(() => import('./components/WaitlistForm'));

// Lazy load pages
const LoginForm = React.lazy(() => import('./components/auth/LoginForm'));
const RegisterForm = React.lazy(() => import('./components/auth/RegisterForm'));
const CheckoutPage = React.lazy(() => import('./components/checkout/CheckoutPage'));
const CheckoutSuccessPage = React.lazy(() => import('./components/checkout/CheckoutSuccessPage'));
const CheckoutCancelPage = React.lazy(() => import('./components/checkout/CheckoutCancelPage'));
const DashboardLayout = React.lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardOverview = React.lazy(() => import('./components/dashboard/DashboardOverview'));
const InvoiceList = React.lazy(() => import('./components/dashboard/invoices/InvoiceList'));
const ClientList = React.lazy(() => import('./components/dashboard/clients/ClientList'));
const ReminderDashboard = React.lazy(() => import('./components/dashboard/reminders/ReminderDashboard'));
const AnalyticsDashboard = React.lazy(() => import('./components/dashboard/analytics/AnalyticsDashboard'));
const SettingsPage = React.lazy(() => import('./components/dashboard/settings/SettingsPage'));
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

// Preload critical routes
if (typeof window !== 'undefined') {
  const criticalRoutes = [Hero, Navbar, Footer];
  criticalRoutes.forEach(component => component.preload?.());
}

const LandingPage = () => (
  <PageTransition>
    <Suspense fallback={<LoadingSpinner />}>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Pricing />
      <Testimonials />
      <WaitlistForm />
      <Footer />
    </Suspense>
  </PageTransition>
);

// Dashboard wrapper component to handle nested Suspense boundaries
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </DashboardLayout>
  </Suspense>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen">
          <Toaster position="top-right" />
          <ScrollToTop />
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <LoginForm />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/register" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <RegisterForm />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardWrapper>
                    <DashboardOverview />
                  </DashboardWrapper>
                </ProtectedRoute>
              </Suspense>
            } />
            
            <Route path="/dashboard/invoices" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardWrapper>
                    <InvoiceList />
                  </DashboardWrapper>
                </ProtectedRoute>
              </Suspense>
            } />

            <Route path="/dashboard/clients" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardWrapper>
                    <ClientList />
                  </DashboardWrapper>
                </ProtectedRoute>
              </Suspense>
            } />

            <Route path="/dashboard/reminders" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardWrapper>
                    <ReminderDashboard />
                  </DashboardWrapper>
                </ProtectedRoute>
              </Suspense>
            } />

            <Route path="/dashboard/analytics" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardWrapper>
                    <AnalyticsDashboard />
                  </DashboardWrapper>
                </ProtectedRoute>
              </Suspense>
            } />

            <Route path="/dashboard/settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <DashboardWrapper>
                    <SettingsPage />
                  </DashboardWrapper>
                </ProtectedRoute>
              </Suspense>
            } />
            
            {/* Footer Pages */}
            <Route path="/about" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <AboutPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/blog" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <BlogPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/roadmap" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <RoadmapPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/integrations" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <IntegrationsPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/careers" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <CareersPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/help" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <HelpCenterPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/contact" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <ContactPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/privacy" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <PrivacyPolicyPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/terms" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <TermsPage />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Checkout Routes */}
            <Route path="/checkout/:planId" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <CheckoutPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/checkout/success" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <CheckoutSuccessPage />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/checkout/cancel" element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner />}>
                  <CheckoutCancelPage />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;