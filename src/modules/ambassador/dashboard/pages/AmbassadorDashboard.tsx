/**
 * Ambassador Dashboard
 * 
 * Main dashboard shell for the Ambassador persona.
 * Features:
 * - Gold/Amber theme color scheme
 * - Identity section with AMB-XXXX ID
 * - Stats cards for verifications and earnings
 * - Quick action buttons
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BadgeCheck, 
  Clock, 
  Wallet, 
  CheckCircle2, 
  TrendingUp,
  MapPin,
  ArrowRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  fetchAmbassadorStats, 
  fetchAmbassadorProfile,
  type AmbassadorStats, 
  type AmbassadorProfile 
} from '../../api/ambassador.service';
import AmbassadorIdentitySection from '../components/AmbassadorIdentitySection';

export default function AmbassadorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [profile, setProfile] = useState<AmbassadorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsResponse, profileResponse] = await Promise.all([
        fetchAmbassadorStats(),
        fetchAmbassadorProfile(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (profileResponse.success) {
        setProfile(profileResponse.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-role-ambassador border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-role-ambassador text-white rounded-lg font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      {/* Header */}
      <div className="px-4 md:px-6 py-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Ambassador Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify properties, earn commissions
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-6">
        {/* Identity Section */}
        {profile && (
          <AmbassadorIdentitySection
            profile={profile}
            userName={user?.firstName ? `${user.firstName} ${user.lastName}` : 'Ambassador'}
          />
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Pending Verifications */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.pendingVerifications}</p>
              <p className="text-xs text-muted-foreground mt-1">Verifications</p>
            </motion.div>

            {/* Completed Verifications */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.completedVerifications}</p>
              <p className="text-xs text-muted-foreground mt-1">This month: {stats.monthlyVerifications}</p>
            </motion.div>

            {/* Total Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 text-role-ambassador mb-2">
                <Wallet className="w-5 h-5" />
                <span className="text-xs font-medium">Earnings</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalEarnings)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Pending: {formatCurrency(stats.pendingEarnings)}
              </p>
            </motion.div>

            {/* Verification Rate */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-medium">Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.verificationRate}%</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs text-muted-foreground">{stats.averageRating} avg rating</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
          
          <div className="grid gap-3">
            {/* View Pending Verifications */}
            <button
              onClick={() => navigate('/dashboard/ambassador/verifications')}
              className="w-full flex items-center justify-between p-4 bg-role-ambassador/10 hover:bg-role-ambassador/15 border border-role-ambassador/20 rounded-xl transition-colors touch-target"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-role-ambassador/20 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-role-ambassador" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">View Verifications</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingVerifications || 0} pending tasks
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-role-ambassador" />
            </button>

            {/* View Earnings */}
            <button
              onClick={() => navigate('/dashboard/ambassador/earnings')}
              className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 border border-border rounded-xl transition-colors touch-target"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">View Earnings</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(stats?.pendingEarnings || 0)} pending
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* View Activity */}
            <button
              onClick={() => navigate('/dashboard/ambassador/activity')}
              className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 border border-border rounded-xl transition-colors touch-target"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Activity Log</p>
                  <p className="text-xs text-muted-foreground">
                    View your verification history
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Commission Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-r from-role-ambassador/5 to-amber-50/50 rounded-xl border border-role-ambassador/20 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-role-ambassador/10 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5 text-role-ambassador" />
            </div>
            <div>
              <p className="font-medium text-foreground">2% Verification Commission</p>
              <p className="text-sm text-muted-foreground mt-1">
                Earn 2% of every transaction you verify. Funds are released to your wallet after buyer confirmation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
