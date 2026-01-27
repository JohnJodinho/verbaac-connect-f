import { motion } from 'framer-motion';
import { Shield, Clock, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export type EscrowState = 'none' | 'held' | 'release_window' | 'disputed' | 'released';

interface EscrowData {
  status: EscrowState;
  amount?: number;
  currency?: string;
  releaseDate?: string;
  transactionId?: string;
}

interface ActiveEscrowCardProps {
  escrow?: EscrowData;
}

const statusConfig = {
  none: {
    icon: Shield,
    label: 'No Active Escrow',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'Start a secure transaction to protect your payment',
  },
  held: {
    icon: Shield,
    label: 'Funds Held Securely',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Your payment is protected by Verbaac Secure Pay',
  },
  release_window: {
    icon: Clock,
    label: 'Release Window Open',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Confirm delivery to release funds to seller',
  },
  disputed: {
    icon: AlertTriangle,
    label: 'Under Dispute',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Our team is reviewing your dispute case',
  },
  released: {
    icon: CheckCircle,
    label: 'Funds Released',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Transaction completed successfully',
  },
};

/**
 * ActiveEscrowCard shows the status of funds in Verbaac Secure Pay.
 * Displays: Held, Release Window, or Disputed states.
 */
export function ActiveEscrowCard({ escrow }: ActiveEscrowCardProps) {
  const status = escrow?.status || 'none';
  const config = statusConfig[status];
  const Icon = config.icon;

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-5`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Verbaac Secure Pay</h3>
            <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
          </div>
        </div>
        
        {escrow?.amount && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(escrow.amount, escrow.currency)}
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">{config.description}</p>

      {escrow?.releaseDate && status === 'release_window' && (
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 rounded-lg px-3 py-2 mb-4">
          <Clock className="h-4 w-4" />
          <span>Release by: {new Date(escrow.releaseDate).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/escrow"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          View Details
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {status === 'release_window' && (
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
            Confirm Delivery
          </button>
        )}
      </div>
    </motion.div>
  );
}
