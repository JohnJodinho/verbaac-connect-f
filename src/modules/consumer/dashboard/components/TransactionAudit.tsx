import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import type { EscrowTransaction } from '@/types';

// Mock data
const mockTransactions: EscrowTransaction[] = [
  {
    id: '1',
    transactionRef: 'TXN-2025-001',
    amount: 75000,
    status: 'held',
    payerId: 'user-1',
    payerName: 'John Doe',
    description: 'Rent payment for 2-Bed Flat, Naraguta',
    platformFee: 9000, // 12%
    netAmount: 66000, // 88%
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    transactionRef: 'TXN-2025-002',
    amount: 45000,
    status: 'released',
    payerId: 'user-2',
    payerName: 'Jane Smith',
    description: 'MacBook Air M2 Purchase',
    platformFee: 5400,
    netAmount: 39600,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    transactionRef: 'TXN-2025-003',
    amount: 25000,
    status: 'disputed',
    payerId: 'user-3',
    payerName: 'Mike Johnson',
    description: 'Study Desk & Chair Set',
    platformFee: 3000,
    netAmount: 22000,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '4',
    transactionRef: 'TXN-2025-004',
    amount: 150000,
    status: 'held',
    payerId: 'user-4',
    payerName: 'Sarah Williams',
    description: 'Self-contain Yearly Rent',
    platformFee: 18000,
    netAmount: 132000,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const statusConfig: Record<EscrowTransaction['status'], {
  icon: typeof Clock;
  label: string;
  color: string;
  bgColor: string;
}> = {
  held: {
    icon: Clock,
    label: 'Held',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  released: {
    icon: CheckCircle2,
    label: 'Released',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  disputed: {
    icon: AlertCircle,
    label: 'Disputed',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Transaction Audit Component
 * Table of all escrow transactions with status, amounts, and fee breakdown.
 */
export function TransactionAudit() {
  const [transactions] = useState<EscrowTransaction[]>(mockTransactions);
  const [filter, setFilter] = useState<EscrowTransaction['status'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

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
              <h3 className="text-lg font-semibold text-foreground">Transaction Audit</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
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

      {/* Table/List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No transactions to display</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredTransactions.map((transaction) => {
            const config = statusConfig[transaction.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedId === transaction.id;

            return (
              <div key={transaction.id}>
                {/* Main Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                >
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
                    <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {transaction.description}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span>{transaction.transactionRef}</span>
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
                      Net: {formatCurrency(transaction.netAmount)}
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-muted/30"
                  >
                    <div className="p-4 space-y-4">
                      {/* Fee Breakdown */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <span className="text-muted-foreground block mb-1">Total Amount</span>
                          <span className="font-semibold text-foreground">{formatCurrency(transaction.amount)}</span>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <span className="text-muted-foreground block mb-1">Platform Fee (12%)</span>
                          <span className="font-semibold text-destructive">-{formatCurrency(transaction.platformFee)}</span>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <span className="text-muted-foreground block mb-1">Net Amount (88%)</span>
                          <span className="font-semibold text-emerald-600">{formatCurrency(transaction.netAmount)}</span>
                        </div>
                      </div>

                      {/* Payer Info */}
                      <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                        <div>
                          <span className="text-sm text-muted-foreground">Paid by</span>
                          <p className="font-medium text-foreground">{transaction.payerName}</p>
                        </div>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                                           text-primary hover:text-primary/80 transition-colors">
                          View Details
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
