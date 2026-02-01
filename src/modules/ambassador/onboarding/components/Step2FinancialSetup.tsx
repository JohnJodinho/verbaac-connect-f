/**
 * Step 2: Financial Setup
 * 
 * Collects bank details for receiving the 2% verification commission.
 * Links the AMB-YEAR-SEQ identity to the wallets table.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building, CreditCard, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step2Props {
  data: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

// Mock Nigerian banks list
const BANKS = [
  { code: '058', name: 'GTBank' },
  { code: '033', name: 'UBA' },
  { code: '044', name: 'Access Bank' },
  { code: '011', name: 'First Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '221', name: 'Stanbic IBTC' },
  { code: '050', name: 'Ecobank' },
];

export default function Step2FinancialSetup({ data, onChange, errors }: Step2Props) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);

  const inputClasses = (hasError: boolean) =>
    cn(
      'w-full px-4 py-3.5 bg-card border rounded-xl text-foreground',
      'focus:outline-none focus:ring-2 focus:ring-role-ambassador focus:border-transparent',
      'transition-all duration-200',
      hasError ? 'border-destructive' : 'border-border'
    );

  // Mock account name verification
  const verifyAccountNumber = useCallback(async (accountNumber: string, bankCode: string) => {
    if (accountNumber.length !== 10 || !bankCode) return;
    
    setIsVerifying(true);
    setAccountVerified(false);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock response - in real app this would call Paystack/Flutterwave
    const mockNames = [
      'ADEWALE JOHNSON OLUMIDE',
      'CHIAMAKA BLESSING NWOSU',
      'IBRAHIM MUSA ABUBAKAR',
    ];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    
    onChange('accountName', randomName);
    setIsVerifying(false);
    setAccountVerified(true);
  }, [onChange]);

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = BANKS.find((b) => b.code === e.target.value);
    if (selectedBank) {
      onChange('bankCode', selectedBank.code);
      onChange('bankName', selectedBank.name);
      // Re-verify if account number exists
      if (data.accountNumber.length === 10) {
        verifyAccountNumber(data.accountNumber, selectedBank.code);
      }
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange('accountNumber', value);
    setAccountVerified(false);
    
    if (value.length === 10 && data.bankCode) {
      verifyAccountNumber(value, data.bankCode);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-role-ambassador/10 rounded-2xl flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-role-ambassador" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Financial Setup</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Link your bank account to receive your 2% verification commission
        </p>
      </div>

      {/* Commission Info Banner */}
      <div className="bg-role-ambassador/10 border border-role-ambassador/20 rounded-xl p-4">
        <p className="text-sm text-foreground">
          <strong className="text-role-ambassador">2% Commission:</strong> You earn 2% of every transaction you verify. 
          Earnings are credited to your wallet instantly upon successful verification.
        </p>
      </div>

      {/* Bank Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          Bank Name
        </label>
        <select
          value={data.bankCode}
          onChange={handleBankChange}
          className={inputClasses(!!errors?.bankName)}
        >
          <option value="">Select your bank...</option>
          {BANKS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors?.bankName && (
          <p className="text-xs text-destructive mt-1">{errors.bankName}</p>
        )}
      </div>

      {/* Account Number */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          Account Number
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={data.accountNumber}
            onChange={handleAccountNumberChange}
            placeholder="Enter 10-digit account number"
            className={inputClasses(!!errors?.accountNumber)}
            maxLength={10}
          />
          {isVerifying && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-role-ambassador animate-spin" />
            </div>
          )}
        </div>
        {errors?.accountNumber && (
          <p className="text-xs text-destructive mt-1">{errors.accountNumber}</p>
        )}
        {data.accountNumber.length === 10 && !data.bankCode && (
          <p className="text-xs text-amber-600 mt-1">Please select a bank first</p>
        )}
      </div>

      {/* Account Name (Auto-filled) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <User className="w-4 h-4 text-muted-foreground" />
          Account Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.accountName}
            readOnly
            placeholder={isVerifying ? 'Verifying...' : 'Auto-filled after verification'}
            className={cn(
              inputClasses(!!errors?.accountName),
              'bg-muted cursor-not-allowed',
              accountVerified && 'border-emerald-500 bg-emerald-50/50'
            )}
          />
          {accountVerified && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        {errors?.accountName && (
          <p className="text-xs text-destructive mt-1">{errors.accountName}</p>
        )}
      </div>
    </motion.div>
  );
}
