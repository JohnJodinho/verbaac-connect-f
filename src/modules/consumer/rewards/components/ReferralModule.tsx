import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Gift, 
  Users, 
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import type { ReferralInfo } from '@/types';

interface ReferralModuleProps {
  referralInfo: ReferralInfo;
}

/**
 * ReferralModule Component
 * "Share & Earn" component with unique referral link and sharing options.
 */
export function ReferralModule({ referralInfo }: ReferralModuleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralInfo.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (platform: 'whatsapp' | 'twitter' | 'facebook') => {
    const text = `Join Verbaac Connect and find your perfect student accommodation! Use my referral code: ${referralInfo.referralCode}`;
    const url = referralInfo.referralLink;

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header with Gradient */}
      <div className="relative p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Share & Earn</h3>
            <p className="text-sm text-muted-foreground">Invite friends, earn rewards</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-background rounded-lg border border-border font-mono text-sm text-muted-foreground truncate">
            {referralInfo.referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className={`p-3 rounded-lg transition-all ${
              copied 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {/* Referral Code Badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <span className="text-xs text-muted-foreground">Your code:</span>
          <span className="text-sm font-bold text-primary">{referralInfo.referralCode}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 divide-x divide-border border-t border-b border-border">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Referrals</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{referralInfo.totalReferrals}</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Check className="w-4 h-4" />
            <span className="text-xs">Completed</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{referralInfo.successfulReferrals}</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Earned</span>
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(referralInfo.earnedRewards)}</p>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="p-6">
        <p className="text-sm font-medium text-foreground mb-3">Share via</p>
        <div className="flex gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 
                       bg-[#25D366]/10 text-[#25D366] font-medium rounded-lg 
                       hover:bg-[#25D366]/20 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 
                       bg-[#1DA1F2]/10 text-[#1DA1F2] font-medium rounded-lg 
                       hover:bg-[#1DA1F2]/20 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 
                       bg-[#1877F2]/10 text-[#1877F2] font-medium rounded-lg 
                       hover:bg-[#1877F2]/20 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Pending Rewards */}
        {referralInfo.pendingRewards > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Pending Rewards</p>
                <p className="text-xs text-amber-600">Waiting for referrals to complete verification</p>
              </div>
              <p className="text-lg font-bold text-amber-700">{formatCurrency(referralInfo.pendingRewards)}</p>
            </div>
          </div>
        )}

        {/* View History Link */}
        <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary/80 
                          transition-colors flex items-center justify-center gap-1.5">
          View Referral History
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
