import { motion } from 'framer-motion';
import { Store, Camera, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * SellerIdentitySection
 * 
 * Displays seller-specific identity information:
 * - Seller Username (shop handle)
 * - Shop Logo
 * - Banking verification status
 * - Link to full legal identity profile
 */
export function SellerIdentitySection() {
  const { user } = useAuthStore();

  // Mock seller data - would come from seller profile API
  const sellerData = {
    userName: 'my_gadget_store',
    shopLogo: null, // Would be URL from onboarding
    bankVerified: true,
    bankName: 'Access Bank',
    accountName: 'ADEBAYO OLUMIDE JOHNSON',
    accountNumberMasked: '****3456',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Shop Identity</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your marketplace seller profile
          </p>
        </div>
      </div>

      {/* Shop Identity */}
      <div className="flex items-start gap-6 mb-8">
        {/* Shop Logo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-xl bg-role-seller/10 flex items-center justify-center overflow-hidden border-2 border-role-seller/30 cursor-pointer group hover:border-role-seller transition-colors">
            {sellerData.shopLogo ? (
              <img src={sellerData.shopLogo} alt="Shop Logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-10 h-10 text-role-seller" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Shop Logo</p>
        </div>

        {/* Shop Info */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Seller Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-role-seller">
                @{sellerData.userName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your public marketplace handle
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Legal Identity
            </label>
            <p className="text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              From your profile registration
            </p>
          </div>
        </div>
      </div>

      {/* Banking Verification Status */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-role-seller/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-role-seller" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">Payout Bank Account</h4>
              {sellerData.bankVerified ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Pending
                </span>
              )}
            </div>
            <p className="text-sm text-foreground">
              {sellerData.bankName} • {sellerData.accountNumberMasked}
            </p>
            <p className="text-sm text-muted-foreground">
              {sellerData.accountName}
            </p>
          </div>
        </div>

        {/* KYC Compliance Note */}
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800">
            <strong>KYC Notice:</strong> Your bank account name must match your legal identity 
            on file for payouts to be processed. Contact support if you need to update your details.
          </p>
        </div>
      </div>

      {/* Link to Full Profile */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Need to update your legal identity or contact information?{' '}
          <a href="/dashboard/profile" className="text-role-seller hover:underline font-medium">
            Edit Full Profile →
          </a>
        </p>
      </div>
    </motion.div>
  );
}
