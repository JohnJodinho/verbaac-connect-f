import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentService, type AgentProfile } from '../../services/agent.service';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, CheckCircle2, Building, Users, Wallet, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (isMounted) setIsLoading(true);
      try {
        const data = await agentService.getProfile();
        if (!isMounted) return;

        if (!data) {
          // Redirect to onboarding if no profile found
          navigate('/agent/onboarding');
          return;
        }
        setProfile(data);
      } catch (error) {
        console.error("Failed to load agent profile", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSimulateApproval = async () => {
    await agentService.simulateApproval();
    // Re-fetch profile logic
    const data = await agentService.getProfile();
    setProfile(data);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500">Welcome back, {profile.agency_name || 'Agent'}</p>
        </div>
        
        {/* Verification Status Badge */}
        <div className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 self-start",
          profile.verification_status === 'verified' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        )}>
          {profile.verification_status === 'verified' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <ShieldAlert className="w-4 h-4" />
          )}
          Status: {profile.verification_status.toUpperCase()}
        </div>
      </div>

      {/* Verification Gate / Warning */}
      {profile.verification_status === 'pending' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-6"
        >
          <div className="flex gap-4">
            <div className="p-3 bg-amber-100 rounded-lg h-fit">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
             <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold text-amber-900">Verification In Progress</h3>
              <p className="text-sm text-amber-700 max-w-2xl">
                Your profile is currently under review by our compliance team. Full dashboard access (managing listings, clients) will be unlocked once approved.
              </p>
              
              {/* TEST SIMULATION BUTTON */}
              <div className="pt-2">
                <Button 
                  onClick={handleSimulateApproval}
                  variant="outline" 
                  className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Simulate Admin Approval (Dev Only)
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Active Listings" 
          value="0" 
          icon={Building} 
          trend="+0%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Total Clients" 
          value="0" 
          icon={Users} 
          trend="+0%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Wallet Balance" 
          value="₦0.00" 
          icon={Wallet} 
          trend="No activity" 
          trendUp={true} 
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
          <p>No recent activity to display.</p>
        </div>
      </div>

    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}

function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        <span className={cn("text-xs font-medium mt-1 inline-block", trendUp ? "text-green-600" : "text-red-600")}>
          {trend}
        </span>
      </div>
    </div>
  )
}
