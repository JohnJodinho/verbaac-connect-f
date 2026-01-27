import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import type { EscrowTransaction } from '@/types';

// Mock data
const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: '1',
    transactionRef: 'ESC-2025-001',
    amount: 75000,
    status: 'held',
    payerId: 'user-1',
    payerName: 'Incoming: Sarah Williams',
    description: 'Rent - 2 Bed Flat, Naraguta',
    platformFee: 9000,
    netAmount: 66000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    transactionRef: 'ESC-2025-002',
    amount: 45000,
    status: 'held',
    payerId: 'user-2',
    payerName: 'Outgoing: MacBook Purchase',
    description: 'Awaiting delivery confirmation',
    platformFee: 5400,
    netAmount: 39600,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    transactionRef: 'ESC-2025-003',
    amount: 150000,
    status: 'released',
    payerId: 'user-3',
    payerName: 'Completed: Self-con Yearly',
    description: 'Released to landlord',
    platformFee: 18000,
    netAmount: 132000,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

const statusConfig: Record<EscrowTransaction['status'], {
  icon: typeof Clock;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  held: {
    icon: Clock,
    label: 'Held',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    description: 'Awaiting confirmation',
  },
  released: {
    icon: CheckCircle2,
    label: 'Released',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    description: 'Funds transferred',
  },
  disputed: {
    icon: AlertCircle,
    label: 'Disputed',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Under review',
  },
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
};

/**
 * EscrowTracker Component
 * Displays escrow transactions with status, 12% platform fee, and current state.
 */
export function EscrowTracker() {
  const [transactions] = useState<EscrowTransaction[]>(mockEscrowTransactions);
  const [filter, setFilter] = useState<EscrowTransaction['status'] | 'all'>('all');

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.status === filter);

  // Calculate totals
  const heldTotal = transactions
    .filter((t) => t.status === 'held')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Escrow Tracker</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(heldTotal)} currently held
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {(['all', 'held', 'released', 'disputed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === status
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {status === 'all' ? 'All' : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No escrow transactions</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredTransactions.map((transaction) => {
            const config = statusConfig[transaction.status];
            const StatusIcon = config.icon;
            const isIncoming = transaction.payerName?.startsWith('Incoming');

            return (
              <div
                key={transaction.id}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Direction Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isIncoming ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    {isIncoming ? (
                      <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {transaction.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <span>•</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fee: {formatCurrency(transaction.platformFee)}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Fee Breakdown Bar */}
                <div className="mt-3 ml-14">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${((transaction.netAmount) / transaction.amount) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Net: {formatCurrency(transaction.netAmount)} (88%)</span>
                    <span>Platform: 12%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Link */}
      {transactions.length > 3 && (
        <div className="p-4 border-t border-border">
          <button className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View All Transactions
          </button>
        </div>
      )}
    </motion.div>
  );
}
