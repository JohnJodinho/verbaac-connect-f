import { motion } from 'framer-motion';
import type { TrustScore } from '@/types';

interface TrustScoreGaugeProps {
  trustScore: TrustScore;
}

/**
 * TrustScoreGauge Component
 * Radial/circular progress gauge showing trust/credibility score.
 * Based on successful transactions and confirmed move-ins.
 */
export function TrustScoreGauge({ trustScore }: TrustScoreGaugeProps) {
  const { score, maxScore, factors } = trustScore;
  const percentage = (score / maxScore) * 100;
  
  // Calculate stroke dasharray for the circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine score level
  const getScoreLevel = () => {
    if (percentage >= 80) return { label: 'Excellent', color: 'text-emerald-500', gradient: 'from-emerald-400 to-teal-500' };
    if (percentage >= 60) return { label: 'Good', color: 'text-teal-500', gradient: 'from-teal-400 to-cyan-500' };
    if (percentage >= 40) return { label: 'Fair', color: 'text-amber-500', gradient: 'from-amber-400 to-orange-500' };
    return { label: 'Building', color: 'text-gray-500', gradient: 'from-gray-400 to-gray-500' };
  };

  const level = getScoreLevel();

  const factorItems = [
    { label: 'Transactions', value: factors.successfulTransactions, max: 25, icon: '💰' },
    { label: 'Move-ins', value: factors.confirmedMoveIns, max: 25, icon: '🏠' },
    { label: 'Profile', value: factors.profileCompleteness, max: 25, icon: '👤' },
    { label: 'Verification', value: factors.verificationStatus, max: 25, icon: '✓' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Trust Score</h3>

      <div className="flex flex-col items-center">
        {/* Radial Gauge */}
        <div className="relative w-44 h-44">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-4xl font-bold text-foreground"
            >
              {score}
            </motion.span>
            <span className="text-sm text-muted-foreground">of {maxScore}</span>
            <span className={`text-sm font-semibold ${level.color} mt-1`}>
              {level.label}
            </span>
          </div>
        </div>

        {/* Factor Breakdown */}
        <div className="w-full mt-6 space-y-3">
          {factorItems.map((factor) => {
            const factorPercentage = (factor.value / factor.max) * 100;
            return (
              <div key={factor.label} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <span>{factor.icon}</span>
                    {factor.label}
                  </span>
                  <span className="font-medium text-foreground">
                    {factor.value}/{factor.max}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factorPercentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Improvement Tips */}
        <div className="w-full mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground font-medium mb-1">💡 Tip to improve</p>
          <p className="text-sm text-muted-foreground">
            Complete more successful transactions to boost your trust score and unlock premium features.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
