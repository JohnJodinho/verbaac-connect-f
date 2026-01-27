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
 * Financial core for all personas. Displays:
 * - WalletHero: Available vs Pending (Escrow) balances
 * - EscrowTracker: Transaction table with 12% platform fee
 * - BankAccountForm: Manage withdrawal bank accounts
 * 
 * Requires session re-authentication for all bank-related actions.
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
    // Navigate to fund wallet flow
    console.log('Navigate to fund wallet');
  };

  const handleWithdraw = () => {
    if (!reAuthToken) {
      handleReAuthRequired('withdraw');
      return;
    }
    // Navigate to withdraw flow
    console.log('Navigate to withdraw with token:', reAuthToken);
  };

  return (
    <div className="theme-consumer min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
            <p className="text-muted-foreground">
              Manage your funds and track escrow transactions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="space-y-6">
        {/* Wallet Hero - Full Width */}
        <WalletHero
          availableBalance={walletData.availableBalance}
          pendingBalance={walletData.pendingBalance}
          onFundWallet={handleFundWallet}
          onWithdraw={handleWithdraw}
        />

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Escrow Tracker - Wider Column */}
          <div className="lg:col-span-2">
            <EscrowTracker />
          </div>

          {/* Bank Accounts - Narrower Column */}
          <div className="lg:col-span-1">
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
