import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Users, 
  ClipboardList, 
  Wallet, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MoreVertical,
  Calendar,
  type LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type VerificationStatus = 'pending' | 'verified';

export default function LandlordDashboard() {
  const navigate = useNavigate();
  // 1. Local State for Verification Logic
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  // showMockAdminTool is always true for now
  const showMockAdminTool = true; 

  // 2. Metrics (Mock Data)
  const metrics = [
    {
      label: "Managed Properties",
      value: "12",
      subtext: "+2 this month",
      icon: Building,
      color: "blue",
      trend: "up",
      action: () => navigate('/dashboard/landlord/properties')
    },
    {
      label: "Active Units",
      value: "48",
      subtext: "94% Occupancy",
      icon: Users,
      color: "indigo",
      trend: "up",
      action: () => navigate('/dashboard/landlord/listings')
    },
    {
      label: "Total Revenue",
      value: "₦2.4M",
      subtext: "+12% vs last mo",
      icon: Wallet,
      color: "emerald",
      trend: "up",
      action: () => navigate('/dashboard/landlord/wallet')
    },
    {
      label: "Pending Requests",
      value: "5",
      subtext: "Requires action",
      icon: ClipboardList,
      color: "amber",
      trend: "flat",
      action: () => navigate('/dashboard/landlord/tenants')
    }
  ];

  return (
    <div className="space-y-6 pb-[env(safe-area-inset-bottom)]">
      {/* --- Verification Banner (Conditional) --- */}
      <AnimatePresence>
        {verificationStatus === 'pending' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 border-b border-amber-100 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-900">Verification in Progress</h3>
                <p className="text-xs text-amber-700 mt-1">
                  Your landlord profile is currently being reviewed by our admin team. Some features like withdrawing funds and publishing new listings are restricted.
                </p>
                {/* Mock Admin Tool Button */}
                {showMockAdminTool && (
                   <button 
                    onClick={() => setVerificationStatus('verified')}
                    className="mt-3 text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition-colors"
                   >
                    [Admin Mock] Approve Profile
                   </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 md:px-8 space-y-8">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
          <div>
             <div className="flex items-center gap-2 mb-1">
              <span className="bg-role-landlord/10 text-role-landlord text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Landlord Mode
              </span>
              <span className="text-xs text-gray-400 font-mono">ID: LLD-2026-001</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your portfolio performance.</p>
          </div>
          
          {verificationStatus === 'verified' && (
            <button 
              onClick={() => navigate('/dashboard/landlord/properties/new')}
              className="h-12 px-6 bg-role-landlord text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-role-landlord/20 active:scale-95 transition-all w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </button>
          )}
        </div>

        {/* --- Portfolio Metrics (Horizontal Scroll on Mobile) --- */}
        <div className="w-full -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          <div className="flex md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-0">
             {metrics.map((stat, idx) => (
                <button 
                  key={idx} 
                  onClick={stat.action}
                  className="w-40 md:w-auto bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3 shrink-0 text-left hover:border-role-landlord/30 transition-all active:scale-95"
                >
                   <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border", {
                      'bg-blue-50 text-blue-600 border-blue-100': stat.color === 'blue',
                      'bg-indigo-50 text-indigo-600 border-indigo-100': stat.color === 'indigo',
                      'bg-emerald-50 text-emerald-600 border-emerald-100': stat.color === 'emerald',
                      'bg-amber-50 text-amber-600 border-amber-100': stat.color === 'amber',
                   })}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{stat.label}</p>
                      <p className="text-xl font-black text-gray-900 mt-0.5">{stat.value}</p>
                   </div>
                   <div className="flex items-center gap-1">
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                      <span className={cn("text-[10px] font-bold", stat.trend === 'up' ? "text-emerald-600" : "text-gray-500")}>
                        {stat.subtext}
                      </span>
                   </div>
                </button>
             ))}
          </div>
        </div>

        {/* --- Quick Action Hub --- */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <QuickActionCard 
                icon={Building} 
                label="New Building" 
                color="blue"
                disabled={verificationStatus === 'pending'}
                onClick={() => navigate('/dashboard/landlord/properties/new')}
             />
             <QuickActionCard 
                icon={Calendar} 
                label="Bookings" 
                color="indigo" 
                disabled={verificationStatus === 'pending'}
                onClick={() => navigate('/dashboard/landlord/tenants')}
             />
          </div>
        </div>

        {/* --- Bottom Grid: Recent Properties & Activity --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
          {/* Recent Properties */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                Recent Properties
                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">4 Total</span>
              </h3>
              <button 
                onClick={() => navigate('/dashboard/landlord/properties')}
                className="text-xs font-bold text-role-landlord flex items-center gap-1 hover:underline"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <PropertyCard 
                  key={i} 
                  verified={verificationStatus === 'verified'} 
                  onClick={() => navigate('/dashboard/landlord/properties')}
                />
              ))}
            </div>
          </div>

          {/* Operational Alerts */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 px-1">Operational Alerts</h3>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              
              {verificationStatus === 'pending' ? (
                <div className="flex gap-4 opacity-50">
                   {/* Ghost State for Pending */}
                   <div className="flex-1 text-center py-8">
                      <p className="text-sm text-gray-400">Alerts will appear here once verified.</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Rental Payout Released</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">₦180,000 for Sunset Apartments was released to your available balance.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Tour Request</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Student "Idris Yakubu" requested a physical tour for Room 42.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, label, color, disabled, onClick }: { icon: LucideIcon, label: string, color: string, disabled?: boolean, onClick?: () => void }) {
   const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
      emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
      amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
   };

   return (
      <button 
         onClick={onClick}
         disabled={disabled}
         className={cn(
            "flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all group active:scale-95",
            disabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-role-landlord/30"
         )}
      >
         <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors", colors[color])}>
            <Icon className="w-6 h-6" />
         </div>
         <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">{label}</span>
      </button>
   );
}

function PropertyCard({ verified, onClick }: { verified: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-role-landlord/30 transition-all cursor-pointer"
    >
      <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <Building className="w-6 h-6 text-gray-400 opacity-30" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate group-hover:text-role-landlord transition-colors">Unity Heights Apartments</h4>
        <p className="text-xs text-gray-500 truncate mt-0.5">14 Bauchi Road, Jos North</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
            <Building className="w-3 h-3" />
            8 Units
          </span>
          {verified && (
             <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
               <CheckCircle2 className="w-3 h-3" />
               Verified
             </span>
          )}
        </div>
      </div>

      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}
