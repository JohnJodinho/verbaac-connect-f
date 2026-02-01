/**
 * Welcome Animation
 * 
 * Success screen shown after ambassador activation.
 * Displays the AMB-YEAR-XXXX ID and auto-redirects to dashboard.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeAnimationProps {
  displayId: string;
  onComplete?: () => void;
}

export default function WelcomeAnimation({ displayId, onComplete }: WelcomeAnimationProps) {
  const navigate = useNavigate();

  // Auto-redirect after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
      navigate('/dashboard/ambassador');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
    >
      {/* Animated Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-role-ambassador/30 rounded-full blur-2xl animate-pulse" />
        
        {/* Badge */}
        <div className="relative w-28 h-28 bg-gradient-to-br from-role-ambassador to-amber-600 rounded-full flex items-center justify-center">
          <BadgeCheck className="w-14 h-14 text-white" />
        </div>
        
        {/* Sparkles */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-8 h-8 text-role-ambassador" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl md:text-3xl font-bold text-foreground mb-3"
      >
        Welcome, Ambassador!
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground mb-8 max-w-sm"
      >
        Your ambassador account has been activated successfully. 
        You're now part of the Verbaac Trust Network.
      </motion.p>

      {/* Display ID */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-role-ambassador/10 to-amber-100/50 border border-role-ambassador/30 rounded-2xl px-8 py-4 mb-8"
      >
        <p className="text-sm text-muted-foreground mb-1">Your Ambassador ID</p>
        <p className="text-2xl font-bold text-role-ambassador font-mono tracking-wider">
          {displayId}
        </p>
      </motion.div>

      {/* Earnings reminder */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-muted-foreground mb-6"
      >
        Earn <span className="font-semibold text-role-ambassador">2% commission</span> on every property you verify
      </motion.p>

      {/* Manual redirect button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => {
          onComplete?.();
          navigate('/dashboard/ambassador');
        }}
        className="flex items-center gap-2 px-6 py-3 bg-role-ambassador text-white rounded-xl font-medium hover:bg-role-ambassador/90 transition-colors touch-target"
      >
        Go to Dashboard
        <ArrowRight className="w-4 h-4" />
      </motion.button>

      {/* Auto-redirect notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs text-muted-foreground mt-4"
      >
        Auto-redirecting in a few seconds...
      </motion.p>
    </motion.div>
  );
}
