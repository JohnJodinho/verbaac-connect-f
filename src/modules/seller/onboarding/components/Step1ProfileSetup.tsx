import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, Camera, AtSign, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { Step1ProfileData } from '../schemas/sellerOnboarding.schema';
import { checkUsername } from '../../api/onboarding.service';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface Step1ProfileSetupProps {
  onNext: () => void;
}

export default function Step1ProfileSetup({ onNext }: Step1ProfileSetupProps) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<Step1ProfileData>();

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Debounced username availability check
  const debouncedCheckUsername = useDebouncedCallback(
    useCallback(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameStatus('idle');
        return;
      }

      setUsernameStatus('checking');
      try {
        const response = await checkUsername(username);
        setUsernameStatus(response.available ? 'available' : 'taken');
      } catch {
        // On error, don't block the user - they can proceed and backend will validate
        setUsernameStatus('idle');
      }
    }, []),
    500
  );

  // Check username availability on change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedCheckUsername(e.target.value);
  };

  const handleContinue = async () => {
    // Validate only Step 1 fields
    const valid = await trigger(['userName', 'profilePhotoUrl']);
    if (valid && usernameStatus !== 'taken') {
      onNext();
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-200';

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-role-seller/10 flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-role-seller" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Set Up Your Shop</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create your unique seller identity on the marketplace
        </p>
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
          Seller Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            @
          </span>
          <input
            {...register('userName')}
            onChange={(e) => {
              register('userName').onChange(e);
              handleUsernameChange(e);
            }}
            className={`${inputClasses} pl-8 pr-10`}
            placeholder="my_shop"
          />
          {/* Status indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {usernameStatus === 'checking' && (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            )}
            {usernameStatus === 'available' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {usernameStatus === 'taken' && (
              <XCircle className="w-4 h-4 text-destructive" />
            )}
          </div>
        </div>
        {errors.userName && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {errors.userName.message}
          </p>
        )}
        {usernameStatus === 'taken' && !errors.userName && (
          <p className="text-[0.8rem] font-medium text-destructive">
            This username is already taken
          </p>
        )}
        {usernameStatus === 'available' && (
          <p className="text-[0.8rem] font-medium text-green-600">
            Username is available!
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          This will be your public seller handle (e.g., @my_shop)
        </p>
      </div>

      {/* Profile Photo Field (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-muted-foreground" />
          Shop Logo / Profile Photo
          <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
        </label>
        <div className="flex items-center gap-4">
          {/* Preview placeholder */}
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
            <Camera className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <input
              {...register('profilePhotoUrl')}
              type="url"
              className={inputClasses}
              placeholder="https://example.com/your-logo.png"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste a URL to your shop logo or profile image
            </p>
          </div>
        </div>
        {errors.profilePhotoUrl && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {errors.profilePhotoUrl.message}
          </p>
        )}
      </div>

      {/* Seller Branding Info Card */}
      <div className="rounded-xl bg-role-seller/5 border border-role-seller/20 p-4">
        <h4 className="font-semibold text-sm text-role-seller mb-2">
          💡 Branding Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Choose a memorable username that reflects your products</li>
          <li>• A clear logo helps buyers recognize and trust your shop</li>
          <li>• You can update your profile anytime from settings</li>
        </ul>
      </div>

      {/* Continue Button */}
      <motion.button
        type="button"
        onClick={handleContinue}
        disabled={usernameStatus === 'taken' || usernameStatus === 'checking'}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
      >
        Continue to Payment Setup
      </motion.button>
    </motion.div>
  );
}
