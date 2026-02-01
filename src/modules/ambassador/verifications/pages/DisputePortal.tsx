/**
 * Dispute Portal Page
 * 
 * Restricted area for Tier 3 Ambassadors to handle disputed listings.
 * Includes high-priority re-verification tasks.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  ArrowLeft, 
  AlertTriangle, 
  Search, 
  Loader2, 
  BadgeCheck,
  Zap,
  GanttChartSquare,
  History
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  fetchVerificationTasks, 
  fetchAmbassadorProfile,
  type VerificationTask, 
  type AmbassadorProfile
} from '../../api/ambassador.service';
import VerificationTaskCard from '../components/VerificationTaskCard';

export default function DisputePortal() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [profile, setProfile] = useState<AmbassadorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDisputes = async () => {
      setIsLoading(true);
      try {
        const profileRes = await fetchAmbassadorProfile();
        if (profileRes.success) {
          setProfile(profileRes.data);
          
          // Senior ambassadors only (Tier 3)
          if (profileRes.data.tier === 'tier3') {
            const tasksRes = await fetchVerificationTasks();
            if (tasksRes.success) {
              // Filter for disputes/reverifications
              setTasks(tasksRes.data.filter(t => 
                t.status === 'dispute_reverification' || t.priority === 'high'
              ));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load disputes:', err);
        console.error('Failed to load dispute records');
      } finally {
        setIsLoading(false);
      }
    };

    loadDisputes();
  }, []);

  const isRestricted = profile && profile.tier !== 'tier3';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-destructive animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Authenticating Senior Access...</p>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-8">
          The Dispute Portal is reserved for <span className="text-destructive font-black">Tier 3 Senior Ambassadors</span>. Complete more verifications to level up your tier.
        </p>
        <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <span>Your Progress</span>
            <span className="text-role-ambassador">{profile?.verifiedCount || 0} / 50 Audits</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-role-ambassador transition-all duration-1000" 
              style={{ width: `${Math.min(((profile?.verifiedCount || 0) / 50) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">Level 3 unlocks high-commission dispute audits.</p>
        </div>
        <Link 
          to="/dashboard/ambassador"
          className="mt-8 flex items-center gap-2 text-sm font-bold text-role-ambassador hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Portal Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-destructive rounded-2xl p-6 text-white shadow-xl shadow-destructive/20"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black">Dispute Portal</h1>
                <p className="text-xs text-white/80">Senior Auditor Level: Tier 3</p>
              </div>
            </div>
            <Link to="/dashboard/ambassador" className="p-2 bg-white/10 rounded-full">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          </div>
          <p className="text-sm leading-relaxed text-white/90">
            You are authorized to handle challenged audits. Your decision is final and will affect both the original auditor's rating and the listing's visibility.
          </p>
        </div>
        <AlertTriangle className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
      </motion.div>

      {/* Summary Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 min-w-[140px] shrink-0">
          <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
            <GanttChartSquare className="w-4 h-4 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">Active</p>
            <p className="text-lg font-black">{tasks.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 min-w-[140px] shrink-0">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">Resolved</p>
            <p className="text-lg font-black">128</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 min-w-[140px] shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <History className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">Avg TAT</p>
            <p className="text-lg font-black">4h</p>
          </div>
        </div>
      </div>

      {/* Main Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            Dispute Queue
            <span className="bg-destructive/10 text-destructive text-[10px] px-2 py-0.5 rounded-full">High Priority</span>
          </h3>
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="bg-muted/30 border border-dashed border-border rounded-2xl py-12 text-center">
              <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-bold text-muted-foreground">All clear! No pending disputes.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Excellent job maintaining integrity.</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <VerificationTaskCard
                key={task.id}
                task={task}
                index={index}
                onSelect={(task) => navigate(`/dashboard/ambassador/verifications/${task.id}/audit`)}
              />
            ))
          )}
        </div>
      </div>

      {/* Best Practices for Senior Auditors */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-destructive" />
          Auditor Code of Conduct
        </h3>
        <ul className="space-y-3">
          {[
            'Always document discrepancies with clear photos.',
            'Cross-check rent quotes with neighbors if possible.',
            'Maintain zero communication with the original auditor.',
            'Report any attempted bribery immediately.'
          ].map((rule, i) => (
            <li key={i} className="flex gap-3 text-xs text-muted-foreground leading-tight">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
