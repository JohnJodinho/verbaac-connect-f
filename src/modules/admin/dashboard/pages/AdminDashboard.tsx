import { useState, useEffect } from 'react';
import { adminService, type SystemHealth } from '../../services/admin.service';
import { Activity, Users, FileCheck, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [verificationQueue, setVerificationQueue] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    adminService.getSystemOverview().then(setHealth);
    adminService.getVerificationQueue().then(queue => setVerificationQueue(queue.slice(0, 5)));
    adminService.getRecentActivity().then(setRecentActivity);
  }, []);

  return (
    <div className="p-8 space-y-8">
       {/* Header */}
       <div>
         <h1 className="text-3xl font-bold text-zinc-900">System Overview</h1>
         <p className="text-zinc-500">Real-time platform metrics and health status.</p>
       </div>

       {/* Metrics Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
             label="Active Users"
             value={health?.active_users.toLocaleString() || '...'}
             icon={Users}
             change="+12% today"
             trend="up"
          />
          <MetricCard 
             label="Pending Verifications"
             value={health?.pending_verifications.toString() || '...'}
             icon={FileCheck}
             change="High Load"
             trend="down"
             alert
          />
          <MetricCard 
             label="Escrow Volume"
             value={health ? `₦${(health.total_escrow_volume / 1000000).toFixed(1)}M` : '...'}
             icon={CircleDollarSign}
             change="Stable"
             trend="up"
          />
          <MetricCard 
             label="System Status"
             value={health?.status.toUpperCase() || '...'}
             icon={Activity}
             change={health?.server_uptime || '...'}
             trend="flat"
             color="emerald"
          />
       </div>

       {/* Content Placeholder */}
       <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm min-h-[400px]">
             <h3 className="font-bold text-zinc-900 mb-4">Verification Queue</h3>
             <div className="space-y-4">
                {verificationQueue.length === 0 ? (
                   <div className="text-zinc-400 text-sm text-center py-10">Empty Queue</div>
                ) : (
                   verificationQueue.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
                               {item.full_name.charAt(0)}
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-zinc-900">{item.full_name}</h4>
                               <p className="text-xs text-zinc-500 uppercase tracking-wide">{item.persona_type}</p>
                            </div>
                         </div>
                         <a href="/dashboard/admin/verification" className="text-xs font-medium text-blue-600 hover:underline">Review</a>
                      </div>
                   ))
                )}
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm min-h-[400px]">
             <h3 className="font-bold text-zinc-900 mb-4">Recent Activity</h3>
             <div className="space-y-6">
                {recentActivity.length === 0 ? (
                   <div className="text-zinc-400 text-sm text-center py-10">No recent activity</div>
                ) : (
                   recentActivity.map(log => (
                      <div key={log.id} className="flex gap-4">
                         <div className="relative pt-1">
                            <div className="w-2 h-2 rounded-full bg-zinc-300 ring-4 ring-white z-10 relative"></div>
                            <div className="content-[''] absolute top-3 left-1 w-px h-full bg-zinc-100 -z-0"></div>
                         </div>
                         <div className="pb-2">
                             <p className="text-sm font-medium text-zinc-900">{log.action}</p>
                             <p className="text-xs text-zinc-500">{log.target} • <span className="text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</span></p>
                         </div>
                      </div>
                   ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, change, alert }: any) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-xl border shadow-sm",
      alert ? "border-red-200 bg-red-50/50" : "border-zinc-200"
    )}>
       <div className="flex items-start justify-between mb-4">
          <div className={cn("p-2 rounded-lg", alert ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-600")}>
             <Icon className="w-5 h-5" />
          </div>
          <span className={cn(
             "text-xs font-bold px-2 py-1 rounded-full",
             alert ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
          )}>
             {change}
          </span>
       </div>
       <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
       <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}
