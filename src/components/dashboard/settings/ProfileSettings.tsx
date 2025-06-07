import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
});

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('metadata')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data?.metadata?.name) {
        setName(data.metadata.name);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const validateForm = () => {
    try {
      profileSchema.parse({
        name: name.trim(),
        email: email.trim(),
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !validateForm()) return;

    try {
      setLoading(true);

      // Update user metadata in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          metadata: { name: name.trim() },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update email if changed
      if (email.trim() !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email.trim(),
        });

        if (emailError) throw emailError;
        toast.success('Profile updated! Please check your email to confirm the new address.');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Profile Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Update your personal information and email address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                errors.name ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'
              } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800`}
              placeholder="Enter your full name"
            />
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-error-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                errors.email ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'
              } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800`}
              placeholder="Enter your email address"
            />
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-error-500">{errors.email}</p>
          )}
          {email !== user?.email && (
            <p className="mt-1 text-sm text-warning-600 dark:text-warning-400">
              Changing your email will require verification
            </p>
          )}
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;