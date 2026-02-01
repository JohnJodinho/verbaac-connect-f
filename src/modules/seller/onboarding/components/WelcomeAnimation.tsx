import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Store, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeAnimationProps {
  sellerDisplayId: string;
}

export default function WelcomeAnimation({ sellerDisplayId }: WelcomeAnimationProps) {
  const navigate = useNavigate();

  // Auto-redirect after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard/seller');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Confetti-like particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 0.5,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      {/* Particle effects */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0,
            y: 0,
            x: `${particle.x}vw`,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -100, -200, -300],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 w-2 h-2 rounded-full"
          style={{
            background: `hsl(${280 + Math.random() * 40}, 70%, 60%)`,
          }}
        />
      ))}

      <div className="text-center px-6 max-w-md">
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="relative mx-auto mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-role-seller/20 flex items-center justify-center mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <CheckCircle className="w-12 h-12 text-role-seller" />
            </motion.div>
          </div>
          
          {/* Sparkle decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute -bottom-1 -left-3"
          >
            <Sparkles className="w-5 h-5 text-role-seller" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-foreground mb-3"
        >
          Welcome to <span className="text-role-seller">Seller Mode!</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mb-6"
        >
          Your marketplace profile is now active. Start listing items and earning today!
        </motion.p>

        {/* Seller ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl bg-role-seller/10 border border-role-seller/30 p-4 mb-8"
        >
          <div className="flex items-center justify-center gap-3">
            <Store className="w-5 h-5 text-role-seller" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Your Seller ID</p>
              <p className="font-mono font-bold text-lg text-role-seller">
                {sellerDisplayId}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/dashboard/seller')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-lg bg-role-seller text-white font-semibold transition-all hover:bg-role-seller/90 flex items-center justify-center gap-2"
        >
          Go to Seller Dashboard
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* Auto-redirect notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground mt-4"
        >
          Redirecting automatically in a few seconds...
        </motion.p>
      </div>
    </motion.div>
  );
}
