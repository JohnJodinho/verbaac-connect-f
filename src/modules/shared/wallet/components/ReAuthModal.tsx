import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, X } from 'lucide-react';

interface ReAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reAuthToken: string) => void;
  title?: string;
  description?: string;
}

/**
 * ReAuthModal Component
 * Session re-authentication modal for sensitive actions (bank operations, withdrawals).
 * Required before revealing full bank account numbers or initiating transactions.
 */
export function ReAuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Verify Your Identity',
  description = 'For your security, please enter your password to continue.',
}: ReAuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual walletAPI.reAuthenticate(password)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real implementation, this would return the reAuthToken from the API
      const mockReAuthToken = `reauth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      onSuccess(mockReAuthToken);
      setPassword('');
    } catch {
      setError('Invalid password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-0">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{title}</h2>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 pt-4">
              {/* Security Notice */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This action requires verification. Your session token will expire in 5 minutes.
                </p>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                      error ? 'border-destructive' : 'border-input'
                    } bg-background focus:ring-2 focus:ring-ring focus:border-transparent 
                    transition-all text-base`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground 
                               hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-muted text-foreground font-medium rounded-xl 
                             hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !password}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-xl 
                             hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Verify
                    </>
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Forgot your password?{' '}
                <a href="/auth/reset-password" className="text-primary hover:underline font-medium">
                  Reset it
                </a>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
