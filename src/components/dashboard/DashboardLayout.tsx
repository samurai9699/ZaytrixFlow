import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Search,
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Crown,
  BarChart3,
  BellRing,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import { getProductByPriceId } from '../../stripe-config';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <FileText size={20} />, label: 'Invoices', path: '/dashboard/invoices' },
  { icon: <Users size={20} />, label: 'Clients', path: '/dashboard/clients' },
  { icon: <BellRing size={20} />, label: 'Reminders', path: '/dashboard/reminders' },
  { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        // Fetch user profile data including profile picture
        const { data: profileData, error: profileError } = await supabase
          .from('profiles') // Adjust table name as needed
          .select('profile_picture_url, avatar_url') // Adjust column names as needed
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          // Use whichever column name you have for profile pictures
          const avatarUrl = profileData.profile_picture_url || profileData.avatar_url;
          setProfilePictureUrl(avatarUrl);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsProfilePictureLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('price_id, subscription_status')
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
          return;
        }

        if (data?.price_id && data.subscription_status === 'active') {
          const product = getProductByPriceId(data.price_id);
          setSubscriptionPlan(product?.name || 'Unknown Plan');
        } else {
          setSubscriptionPlan('Free');
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscriptionPlan('Free');
      }
    };

    fetchSubscription();
  }, [user]);

  // Function to refresh profile picture (call this from settings when picture is updated)
  const refreshProfilePicture = async () => {
    if (!user) return;

    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('profile_picture_url, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && profileData) {
        const avatarUrl = profileData.profile_picture_url || profileData.avatar_url;
        setProfilePictureUrl(avatarUrl);
      }
    } catch (error) {
      console.error('Error refreshing profile picture:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/invoices')) return 'Invoices';
    if (path.includes('/clients')) return 'Clients';
    if (path.includes('/reminders')) return 'Reminders';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  // Profile picture component
  const ProfilePicture = ({ size = 'w-8 h-8' }: { size?: string }) => {
    const [imageError, setImageError] = useState(false);

    if (isProfilePictureLoading) {
      return (
        <div className={`${size} rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse`} />
      );
    }

    if (profilePictureUrl && !imageError) {
      return (
        <img
          src={profilePictureUrl}
          alt="Profile"
          className={`${size} rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      );
    }

    // Fallback to icon
    return (
      <div className={`${size} rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center`}>
        <User size={16} className="text-white" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          className={`fixed top-0 left-0 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl z-30 transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          } hidden lg:block`}
          initial={false}
          animate={{ width: isCollapsed ? 80 : 256 }}
        >
          {/* Logo Section */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50">
            <motion.div
              initial={false}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  ZaytrixFlow
                </span>
              )}
            </motion.div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Subscription Status */}
          {!isCollapsed && subscriptionPlan && (
            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className={`p-3 rounded-lg ${
                subscriptionPlan === 'Free' 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200/30 dark:border-primary-800/30'
              }`}>
                <div className="flex items-center gap-2">
                  {subscriptionPlan !== 'Free' && (
                    <Crown className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {subscriptionPlan} Plan
                  </span>
                </div>
                {subscriptionPlan === 'Free' && (
                  <Link
                    to="/#pricing"
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Upgrade now
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"
                      layoutId="activeTab"
                    />
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </motion.aside>
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              className="fixed top-0 left-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl z-50 lg:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                    ZaytrixFlow
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Subscription Status */}
              {subscriptionPlan && (
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className={`p-3 rounded-lg ${
                    subscriptionPlan === 'Free' 
                      ? 'bg-gray-100 dark:bg-gray-700' 
                      : 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200/30 dark:border-primary-800/30'
                  }`}>
                    <div className="flex items-center gap-2">
                      {subscriptionPlan !== 'Free' && (
                        <Crown className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {subscriptionPlan} Plan
                      </span>
                    </div>
                    {subscriptionPlan === 'Free' && (
                      <Link
                        to="/#pricing"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Upgrade now
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <nav className="p-4">
                <div className="space-y-2">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="ml-3 font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top navigation */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <ProfilePicture />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {subscriptionPlan} Plan
                    </p>
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 py-1"
                    >
                      <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {subscriptionPlan} Plan
                        </p>
                      </div>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;