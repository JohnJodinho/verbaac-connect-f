import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon } from 'lucide-react';
import { WalletHero } from '../components/WalletHero';
import { EscrowTracker } from '../components/EscrowTracker';
import { BankAccountForm } from '../components/BankAccountForm';
import { ReAuthModal } from '../components/ReAuthModal';

/**
 * Wallet Page - Shared Module
 * 
 * Mobile-first responsive design:
 * - Stacked single-column on mobile
 * - 3-column grid on desktop
 */
export default function Wallet() {
  const [reAuthToken, setReAuthToken] = useState<string | null>(null);
  const [showReAuthModal, setShowReAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'bank' | 'withdraw' | null>(null);

  // Mock wallet data
  const walletData = {
    availableBalance: 125000,
    pendingBalance: 225000,
  };

  const handleReAuthRequired = (action: 'bank' | 'withdraw' = 'bank') => {
    setPendingAction(action);
    setShowReAuthModal(true);
  };

  const handleReAuthSuccess = (token: string) => {
    setReAuthToken(token);
    setShowReAuthModal(false);
    
    // Token expires after 5 minutes
    setTimeout(() => {
      setReAuthToken(null);
    }, 5 * 60 * 1000);
  };

  const handleFundWallet = () => {
    console.log('Navigate to fund wallet');
  };

  const handleWithdraw = () => {
    if (!reAuthToken) {
      handleReAuthRequired('withdraw');
      return;
    }
    console.log('Navigate to withdraw with token:', reAuthToken);
  };

  return (
    <div className="theme-consumer w-full max-w-full">
      {/* Page Header - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <WalletIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">My Wallet</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              Manage funds and escrow
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content - Stacked on mobile */}
      <div className="space-y-4 md:space-y-6">
        {/* Wallet Hero - Full Width */}
        <WalletHero
          availableBalance={walletData.availableBalance}
          pendingBalance={walletData.pendingBalance}
          onFundWallet={handleFundWallet}
          onWithdraw={handleWithdraw}
        />

        {/* Grid: Full-width stack on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Escrow Tracker - Full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <EscrowTracker />
          </div>

          {/* Bank Accounts - Full width on mobile, 1 col on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <BankAccountForm
              onReAuthRequired={() => handleReAuthRequired('bank')}
              reAuthToken={reAuthToken}
            />
          </div>
        </div>
      </div>

      {/* Re-Authentication Modal */}
      <ReAuthModal
        isOpen={showReAuthModal}
        onClose={() => {
          setShowReAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleReAuthSuccess}
        title={
          pendingAction === 'withdraw' 
            ? 'Verify to Withdraw' 
            : 'Verify Your Identity'
        }
        description={
          pendingAction === 'withdraw'
            ? 'Enter your password to initiate a withdrawal.'
            : 'Enter your password to manage bank accounts.'
        }
      />
    </div>
  );
}
