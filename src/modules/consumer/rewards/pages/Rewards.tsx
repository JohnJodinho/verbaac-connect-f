import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { TrustScoreGauge } from '../components/TrustScoreGauge';
import { ReferralModule } from '../components/ReferralModule';
import type { TrustScore, ReferralInfo } from '@/types';

// Mock data
const mockTrustScore: TrustScore = {
  score: 72,
  maxScore: 100,
  factors: {
    successfulTransactions: 18,
    confirmedMoveIns: 15,
    profileCompleteness: 22,
    verificationStatus: 17,
  },
};

const mockReferralInfo: ReferralInfo = {
  referralCode: 'VERBA-JD2025',
  referralLink: 'https://verbacc.com/r/VERBA-JD2025',
  totalReferrals: 8,
  successfulReferrals: 5,
  pendingRewards: 5000,
  earnedRewards: 15000,
};

/**
 * Rewards Page - Consumer Module
 * 
 * Mobile-first responsive design:
 * - Compact header with responsive sizing
 * - Badge containers with flex-wrap
 * - Stacked grid layout on mobile
 */
export default function Rewards() {
  return (
    <div className="theme-consumer w-full max-w-full">
      {/* Page Header - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 
                          flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Rewards & Trust</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              Build credibility and earn rewards
            </p>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badges Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 
                   rounded-xl border border-primary/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm md:text-base">Trusted Student</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">You're in the top 30% of verified users</p>
            </div>
          </div>
          {/* Badges with flex-wrap for mobile */}
          <div className="flex gap-2 flex-wrap">
            {['🎓', '🏠', '💰', '⭐'].map((emoji, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border 
                           flex items-center justify-center text-lg md:text-xl shadow-sm"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Grid - Stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Trust Score */}
        <TrustScoreGauge trustScore={mockTrustScore} />

        {/* Referral Module */}
        <ReferralModule referralInfo={mockReferralInfo} />
      </div>

      {/* Rewards Tiers (Coming Soon) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 md:mt-6 p-4 md:p-6 bg-card rounded-xl border border-border shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <Star className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base md:text-lg font-semibold text-foreground">Reward Tiers</h3>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { name: 'Bronze', range: '0-30', benefits: ['Basic features', 'Standard support'], color: 'from-amber-600 to-amber-700' },
            { name: 'Silver', range: '31-70', benefits: ['Priority listings', 'Reduced fees'], color: 'from-gray-400 to-gray-500' },
            { name: 'Gold', range: '71-100', benefits: ['VIP support', 'Exclusive deals', 'Zero fees'], color: 'from-yellow-400 to-amber-500' },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`p-3 md:p-4 rounded-lg border ${
                mockTrustScore.score >= parseInt(tier.range.split('-')[0]) &&
                mockTrustScore.score <= parseInt(tier.range.split('-')[1])
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-muted/30'
              }`}
            >
              <div className={`inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-gradient-to-r ${tier.color} 
                              text-white text-xs md:text-sm font-semibold mb-2`}>
                {tier.name}
              </div>
              <p className="text-xs text-muted-foreground mb-2">Score: {tier.range}</p>
              <ul className="space-y-1">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="text-xs md:text-sm text-foreground flex items-center gap-1.5">
                    <span className="text-primary shrink-0">✓</span>
                    <span className="break-words">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

