import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  Plus, 
  Star, 
  Eye, 
  EyeOff, 
  Trash2,
  MoreHorizontal,
  Shield
} from 'lucide-react';
import type { BankAccount } from '@/types';

// Mock data
const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'First Bank of Nigeria',
    accountName: 'John Doe',
    accountNumber: '****6789',
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    bankName: 'GTBank',
    accountName: 'John Doe',
    accountNumber: '****4321',
    isPrimary: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface BankAccountFormProps {
  onReAuthRequired: () => void;
  reAuthToken?: string | null;
}

/**
 * BankAccountForm Component
 * Manages withdrawal bank accounts linked to the user's profile.
 * Requires re-authentication for all operations.
 */
export function BankAccountForm({ onReAuthRequired, reAuthToken }: BankAccountFormProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [revealedAccounts, setRevealedAccounts] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleRevealAccount = (id: string) => {
    if (!reAuthToken) {
      onReAuthRequired();
      return;
    }
    setRevealedAccounts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddAccount = () => {
    if (!reAuthToken) {
      onReAuthRequired();
      return;
    }
    setShowAddForm(true);
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reAuthToken) {
      onReAuthRequired();
      return;
    }

    // Mock add account
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...formData,
      accountNumber: `****${formData.accountNumber.slice(-4)}`,
      isPrimary: accounts.length === 0,
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, newAccount]);
    setFormData({ bankName: '', accountNumber: '', accountName: '' });
    setShowAddForm(false);
  };

  const handleDeleteAccount = async (id: string) => {
    if (!reAuthToken) {
      onReAuthRequired();
      return;
    }
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetPrimary = async (id: string) => {
    if (!reAuthToken) {
      onReAuthRequired();
      return;
    }
    setAccounts((prev) =>
      prev.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Bank Accounts</h3>
            <p className="text-sm text-muted-foreground">
              {accounts.length} linked account{accounts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={handleAddAccount}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground 
                     text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg mb-4 text-sm text-muted-foreground">
        <Shield className="w-4 h-4 flex-shrink-0" />
        <span>All bank operations require password verification for your security.</span>
      </div>

      {/* Account List */}
      {accounts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Landmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No bank accounts linked</p>
          <p className="text-sm mt-1">Add a bank account to receive withdrawals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const isRevealed = revealedAccounts.has(account.id);
            const isExpanded = expandedId === account.id;

            return (
              <div
                key={account.id}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  account.isPrimary ? 'border-primary/30 bg-primary/5' : 'border-border'
                }`}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Bank Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    account.isPrimary ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Landmark className={`w-5 h-5 ${
                      account.isPrimary ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>

                  {/* Account Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{account.bankName}</span>
                      {account.isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 
                                         text-primary text-xs font-medium rounded-full">
                          <Star className="w-3 h-3" />
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <span>{account.accountName}</span>
                      <span>•</span>
                      <span className="font-mono">
                        {isRevealed ? '1234567890' : account.accountNumber}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRevealAccount(account.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title={isRevealed ? 'Hide account number' : 'Reveal account number'}
                    >
                      {isRevealed ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : account.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Expanded Actions */}
                {isExpanded && (
                  <div className="border-t border-border p-3 bg-muted/30 flex gap-2">
                    {!account.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(account.id)}
                        className="flex-1 py-2 px-3 text-sm font-medium text-primary 
                                   bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        Set as Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="py-2 px-3 text-sm font-medium text-destructive 
                                 bg-destructive/10 rounded-lg hover:bg-destructive/20 
                                 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Account Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 border border-border rounded-lg bg-muted/30"
        >
          <h4 className="font-medium text-foreground mb-4">Add New Bank Account</h4>
          <form onSubmit={handleSubmitAccount} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bank Name</label>
              <select
                value={formData.bankName}
                onChange={(e) => setFormData((p) => ({ ...p, bankName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background 
                           focus:ring-2 focus:ring-ring focus:border-transparent"
                required
              >
                <option value="">Select a bank</option>
                <option value="Access Bank">Access Bank</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="GTBank">GTBank</option>
                <option value="UBA">UBA</option>
                <option value="Zenith Bank">Zenith Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData((p) => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="Enter 10-digit account number"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background 
                           focus:ring-2 focus:ring-ring focus:border-transparent font-mono"
                required
                minLength={10}
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Name</label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData((p) => ({ ...p, accountName: e.target.value }))}
                placeholder="Name on account"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background 
                           focus:ring-2 focus:ring-ring focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 px-4 bg-muted text-foreground font-medium rounded-lg 
                           hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground font-medium 
                           rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Account
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}
