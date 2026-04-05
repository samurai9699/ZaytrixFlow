import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Loader2, Camera, X } from 'lucide-react';
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Real-time validation state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user && !initialDataLoaded) {
      initializeUserData();
    }
  }, [user, initialDataLoaded]);

  const initializeUserData = async () => {
    if (!user) return;

    try {
      setEmail(user.email || '');
      
      // Try to get name from user metadata first, then from database
      let userName = '';
      if (user.user_metadata?.name || user.user_metadata?.full_name) {
        userName = user.user_metadata.name || user.user_metadata.full_name;
      }

      // Fetch additional profile data from database
      const { data, error } = await supabase
        .from('users')
        .select('metadata, profile_image_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching user profile:', error);
      }

      if (data) {
        // Use database name if available, otherwise use auth metadata name
        if (data.metadata?.name) {
          userName = data.metadata.name;
        }
        if (data.profile_image_url) {
          setProfileImageUrl(data.profile_image_url);
        }
      }

      setName(userName);
      setInitialDataLoaded(true);
    } catch (error) {
      console.error('Error initializing user data:', error);
      setInitialDataLoaded(true);
    }
  };

  // Real-time validation
  const validateName = (value: string) => {
    try {
      z.string().min(1, 'Name is required').parse(value.trim());
      setNameError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0].message);
      }
      return false;
    }
  };

  const validateEmail = (value: string) => {
    try {
      z.string().email('Valid email is required').parse(value.trim());
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
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

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;

    try {
      setUploadingImage(true);

      // Generate unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !validateForm()) return;

    try {
      setLoading(true);

      let newImageUrl = profileImageUrl;

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadProfileImage();
        if (uploadedUrl) {
          newImageUrl = uploadedUrl;
        } else {
          // If image upload fails, don't proceed with the rest
          return;
        }
      }

      // Prepare update data
      const updateData = {
        metadata: { name: name.trim() },
        profile_image_url: newImageUrl,
        updated_at: new Date().toISOString(),
      };

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...updateData
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      // Update email if changed
      const emailChanged = email.trim() !== user.email;
      if (emailChanged) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email.trim(),
        });

        if (emailError) {
          // Rollback database changes if email update fails
          await supabase
            .from('users')
            .update({
              metadata: { name: user.user_metadata?.name || '' },
              profile_image_url: profileImageUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
          
          throw new Error(`Email update failed: ${emailError.message}`);
        }
        toast.success('Profile updated! Please check your email to confirm the new address.');
      } else {
        toast.success('Profile updated successfully!');
      }

      // Update local state
      setProfileImageUrl(newImageUrl);
      setImageFile(null);
      setImagePreview('');

    } catch (error: Error | unknown) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentImage = imagePreview || profileImageUrl;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Profile Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Update your personal information, email address, and profile picture.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Profile Picture
          </label>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Camera className="h-4 w-4 mr-2" />
                Choose Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  disabled={loading || uploadingImage}
                />
              </label>
              
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImageSelection}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-error-500"
                  disabled={loading || uploadingImage}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG, or WebP. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={loading || uploadingImage}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                (errors.name || nameError) ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'
              } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Enter your full name"
            />
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {(errors.name || nameError) && (
            <p className="mt-1 text-sm text-error-500">{errors.name || nameError}</p>
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
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={loading || uploadingImage}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                (errors.email || emailError) ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'
              } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Enter your email address"
            />
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {(errors.email || emailError) && (
            <p className="mt-1 text-sm text-error-500">{errors.email || emailError}</p>
          )}
          {email !== user?.email && email.trim() && !emailError && (
            <p className="mt-1 text-sm text-warning-600 dark:text-warning-400">
              Changing your email will require verification
            </p>
          )}
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={loading || uploadingImage || !!nameError || !!emailError}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: (loading || uploadingImage) ? 1 : 1.02 }}
            whileTap={{ scale: (loading || uploadingImage) ? 1 : 0.98 }}
          >
            {(loading || uploadingImage) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadingImage ? 'Uploading...' : 'Saving...'}
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
