import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useSignUp } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { z } from 'zod';
import AuthLayout from './AuthLayout';
import { supabase } from '../../lib/supabase';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { isLoading, signUp, signUpWithOAuth } = useSignUp();
  const navigate = useNavigate();

  const validateForm = () => {
    try {
      registerSchema.parse({ email, password, name });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
      });

      if (result.status === 'complete') {
        // Create user record in Supabase
        await supabase.from('users').insert([
          {
            id: result.createdUserId,
            email,
            metadata: { name }
          }
        ]);

        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to create account');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signUpWithOAuth({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error) {
      toast.error('Failed to sign up with Google');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your invoices today"
    >
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`
                  block w-full px-4 py-3 rounded-lg
                  bg-gray-50 dark:bg-gray-900
                  border ${errors.name ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'}
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                  focus:border-transparent
                  transition-colors
                `}
                placeholder="John Doe"
              />
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-error-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  block w-full px-4 py-3 rounded-lg
                  bg-gray-50 dark:bg-gray-900
                  border ${errors.email ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'}
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                  focus:border-transparent
                  transition-colors
                `}
                placeholder="you@example.com"
              />
              <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  block w-full px-4 py-3 rounded-lg
                  bg-gray-50 dark:bg-gray-900
                  border ${errors.password ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'}
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                  focus:border-transparent
                  transition-colors
                `}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-500">{errors.password}</p>
            )}
          </div>

          {/* Add the Clerk CAPTCHA element */}
          <div id="clerk-captcha" className="mt-4"></div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-gradient-to-r from-primary-600 to-secondary-500
              text-white font-medium
              hover:shadow-lg hover:shadow-primary-500/20
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.span
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </span>
            ) : (
              'Create Account'
            )}
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </motion.button>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;