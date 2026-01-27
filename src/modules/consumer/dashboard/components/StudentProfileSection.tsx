import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Hash, MapPin, Loader2, Save, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { studentProfileSchema } from '../schemas/profileSchema';
import { profileAPI } from '../api/profile.api';
import { z } from 'zod';

interface StudentValidationErrors {
  institution?: string;
  matricNo?: string;
  level?: string;
}

export function StudentProfileSection() {
  const { user, updateUser } = useAuthStore();
  const { formData, setField, setMultipleFields } = useProfileStore();
  const [errors, setErrors] = useState<StudentValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const isStudent = !!user?.studentProfile;
  const hasChanges = 
    formData.institution !== (user?.studentProfile?.institution || '') ||
    formData.matricNo !== (user?.studentProfile?.matricNo || '') ||
    formData.level !== (user?.studentProfile?.level || null);

  const handleSaveStudent = async () => {
    try {
      const validData = studentProfileSchema.parse({
        institution: formData.institution,
        matricNo: formData.matricNo,
        level: formData.level,
        preferredZones: formData.preferredZones,
      });

      setErrors({});
      setIsSaving(true);

      const response = await profileAPI.updateTenantProfile({
        institution: validData.institution,
        matricNo: validData.matricNo,
        level: validData.level,
        preferredZones: validData.preferredZones,
      });

      if (response.data.data) {
        updateUser(response.data.data);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: StudentValidationErrors = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof StudentValidationErrors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivateStudent = () => {
    setIsActivating(true);
    // Would navigate to student verification wizard
    // For now, just show the form
    setMultipleFields({
      institution: '',
      matricNo: '',
      level: 100,
    });
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
      transition={{ delay: 0.1 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-role-consumer/10 rounded-lg">
          <GraduationCap className="w-5 h-5 text-role-consumer" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Student Profile</h2>
          <p className="text-sm text-muted-foreground">
            {isStudent ? 'Your verified student identity' : 'Unlock student-exclusive features'}
          </p>
        </div>
        {isStudent && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Verified Student
          </span>
        )}
      </div>

      {isStudent || isActivating ? (
        /* Student Form */
        <div className="space-y-4">
          {/* Institution */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Institution
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setField('institution', e.target.value)}
              className={inputClasses(!!errors.institution)}
              placeholder="e.g., University of Jos"
            />
            {errors.institution && (
              <p className="text-xs text-destructive mt-1">{errors.institution}</p>
            )}
          </div>

          {/* Matric Number */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Hash className="w-4 h-4 text-muted-foreground" />
              Matric Number
            </label>
            <input
              type="text"
              value={formData.matricNo}
              onChange={(e) => setField('matricNo', e.target.value)}
              className={inputClasses(!!errors.matricNo)}
              placeholder="e.g., UJ/2022/CS/1234"
            />
            {errors.matricNo && (
              <p className="text-xs text-destructive mt-1">{errors.matricNo}</p>
            )}
          </div>

          {/* Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Current Level
            </label>
            <select
              value={formData.level || ''}
              onChange={(e) => setField('level', e.target.value ? parseInt(e.target.value) : null)}
              className={inputClasses(!!errors.level)}
            >
              <option value="">Select your level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
              <option value="600">600 Level (Postgrad)</option>
            </select>
            {errors.level && (
              <p className="text-xs text-destructive mt-1">{errors.level}</p>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveStudent}
              disabled={(!hasChanges && !isActivating) || isSaving}
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
                  {isActivating ? 'Activate Student Profile' : 'Update Student Info'}
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* CTA to Activate Student Profile */
        <div className="bg-gradient-to-br from-role-consumer/5 to-role-consumer/10 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-role-consumer/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-role-consumer" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Become a Verified Student
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Unlock exclusive access to roommate matching, student-only housing deals, and more.
          </p>
          <button
            onClick={handleActivateStudent}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-role-consumer text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Get Verified
          </button>
        </div>
      )}
    </motion.div>
  );
}
