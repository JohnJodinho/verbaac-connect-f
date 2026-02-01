import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIScoreIndicatorProps {
  score: number;
  label?: string;
  className?: string;
}

/**
 * AI Score Indicator Component
 * 
 * Displays the AI computer vision match score as a radial gauge
 * Higher scores = images match closely
 * Lower scores = significant discrepancy detected
 */
export default function AIScoreIndicator({ score, label = 'Image Match', className }: AIScoreIndicatorProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return { stroke: 'stroke-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 70) return { stroke: 'stroke-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
    return { stroke: 'stroke-red-500', text: 'text-red-600', bg: 'bg-red-50' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Good Match';
    if (score >= 70) return 'Partial Match';
    return 'Mismatch Detected';
  };

  const colors = getScoreColor(score);
  
  // Calculate stroke dasharray for circular progress
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          {/* Progress circle */}
          <motion.circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={colors.stroke}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ strokeDasharray }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', colors.text)}>{score}%</span>
        </div>
      </div>

      {/* Labels */}
      <p className="text-xs text-muted-foreground mt-2">{label}</p>
      <p className={cn('text-sm font-medium', colors.text)}>{getScoreLabel(score)}</p>
    </div>
  );
}
