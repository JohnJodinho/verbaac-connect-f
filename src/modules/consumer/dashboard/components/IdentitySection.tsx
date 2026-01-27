import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, Phone, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { globalIdentitySchema } from '../schemas/profileSchema';
import { profileAPI } from '../api/profile.api';
import { z } from 'zod';

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  dateOfBirth?: string;
}

export function IdentitySection() {
  const { user, updateUser } = useAuthStore();
  const { formData, setField, isDirty, isSaving, setIsSaving, markAsSaved, initializeFromUser } = useProfileStore();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data from user on mount
  useEffect(() => {
    if (user) {
      initializeFromUser(user);
      if (user.profilePhotoUrl) {
        setAvatarPreview(user.profilePhotoUrl);
      }
    }
  }, [user, initializeFromUser]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        const response = await profileAPI.uploadAvatar(file);
        if (response.data.data?.url) {
          updateUser({ profilePhotoUrl: response.data.data.url });
        }
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const handleSave = async () => {
    // Validate with Zod
    try {
      const validData = globalIdentitySchema.parse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      });

      setErrors({});
      setIsSaving(true);

      // Send to API
      const response = await profileAPI.updateUserProfile({
        firstName: validData.firstName,
        lastName: validData.lastName,
        middleName: validData.middleName,
        gender: validData.gender,
        dateOfBirth: validData.dateOfBirth,
      });

      if (response.data.data) {
        updateUser(response.data.data);
        markAsSaved();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: ValidationErrors = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ValidationErrors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Failed to update profile:', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-destructive focus:ring-destructive/30'
        : 'border-input bg-background focus:ring-role-consumer/30 focus:border-role-consumer'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your legal identity on Verbaac Connect
          </p>
        </div>
        {isDirty && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
      </div>

      {/* Avatar Section */}
      <div className="flex items-start gap-6 mb-8">
        <div className="relative">
          <div
            onClick={handleAvatarClick}
            className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer group border-2 border-border hover:border-role-consumer transition-colors"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">
                {formData.firstName?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Contact Info (Read-only with badges) */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user?.email || 'No email'}</span>
            {user?.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user?.phoneNumber || 'No phone'}</span>
            {user?.phoneNumber && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            First Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            className={inputClasses(!!errors.firstName)}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Last Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            className={inputClasses(!!errors.lastName)}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Middle Name
          </label>
          <input
            type="text"
            value={formData.middleName}
            onChange={(e) => setField('middleName', e.target.value)}
            className={inputClasses(!!errors.middleName)}
            placeholder="Enter middle name (optional)"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Gender <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setField('gender', e.target.value as 'male' | 'female' | '')}
            className={inputClasses(!!errors.gender)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-xs text-destructive mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Date of Birth <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setField('dateOfBirth', e.target.value)}
            className={inputClasses(!!errors.dateOfBirth)}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-role-consumer text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
