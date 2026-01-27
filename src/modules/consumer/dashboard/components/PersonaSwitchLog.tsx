import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  Building2, 
  ArrowRight,
  Clock,
  Filter
} from 'lucide-react';
import type { RoleType, PersonaSwitch } from '@/types';

// Mock data
const mockSwitches: PersonaSwitch[] = [
  {
    id: '1',
    fromRole: 'consumer',
    toRole: 'seller',
    switchedAt: new Date().toISOString(),
  },
  {
    id: '2',
    fromRole: 'seller',
    toRole: 'consumer',
    switchedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    fromRole: 'consumer',
    toRole: 'landlord',
    switchedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    fromRole: 'landlord',
    toRole: 'consumer',
    switchedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

const roleConfig: Record<RoleType, {
  icon: typeof User;
  label: string;
  color: string;
  bgColor: string;
}> = {
  consumer: {
    icon: User,
    label: 'Consumer',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  seller: {
    icon: ShoppingBag,
    label: 'Seller',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  landlord: {
    icon: Building2,
    label: 'Landlord',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  agent: {
    icon: Building2,
    label: 'Agent',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  ambassador: {
    icon: User,
    label: 'Ambassador',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  admin: {
    icon: User,
    label: 'Admin',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
};

const formatFullDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Persona Switch Log Component
 * Timeline of role transitions between Consumer, Seller, Landlord modes.
 */
export function PersonaSwitchLog() {
  const [switches] = useState<PersonaSwitch[]>(mockSwitches);
  const [filter, setFilter] = useState<RoleType | 'all'>('all');

  const filteredSwitches = filter === 'all' 
    ? switches 
    : switches.filter(s => s.fromRole === filter || s.toRole === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Persona Switch Log</h3>
            <p className="text-sm text-muted-foreground">Track your role transitions</p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as RoleType | 'all')}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-muted border-0 rounded-lg 
                       focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="consumer">Consumer</option>
            <option value="seller">Seller</option>
            <option value="landlord">Landlord</option>
          </select>
          <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Timeline */}
      {filteredSwitches.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No persona switches to display</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {filteredSwitches.map((switchItem, index) => {
              const fromConfig = roleConfig[switchItem.fromRole];
              const toConfig = roleConfig[switchItem.toRole];
              const FromIcon = fromConfig.icon;
              const ToIcon = toConfig.icon;

              return (
                <motion.div
                  key={switchItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 pl-12"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-3.5 w-3 h-3 rounded-full bg-primary border-4 border-background z-10" />

                  {/* Switch Card */}
                  <div className="flex-1 p-4 bg-muted/50 rounded-lg border border-border/50 
                                  hover:border-border transition-colors">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* From Role */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${fromConfig.bgColor}`}>
                        <FromIcon className={`w-4 h-4 ${fromConfig.color}`} />
                        <span className={`text-sm font-medium ${fromConfig.color}`}>
                          {fromConfig.label}
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-muted-foreground" />

                      {/* To Role */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${toConfig.bgColor}`}>
                        <ToIcon className={`w-4 h-4 ${toConfig.color}`} />
                        <span className={`text-sm font-medium ${toConfig.color}`}>
                          {toConfig.label}
                        </span>
                      </div>

                      {/* Time */}
                      <span className="ml-auto text-xs text-muted-foreground" title={formatFullDate(switchItem.switchedAt)}>
                        {formatTimeAgo(switchItem.switchedAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* View All Link */}
      {switches.length > 5 && (
        <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All Switches
        </button>
      )}
    </motion.div>
  );
}
