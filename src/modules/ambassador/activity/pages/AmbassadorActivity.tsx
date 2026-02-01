/**
 * Ambassador Activity Page
 * 
 * Professional activity log for Verbaac Ambassadors.
 * Tracks verifications, financial milestones, and dispute hits.
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BadgeCheck, 
  Wallet, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Loader2,
  Rocket,
  AlertTriangle,
  History
} from 'lucide-react';
import { 
  fetchAmbassadorActivity, 
  type AmbassadorActivityEvent, 
  type AmbassadorActivityType 
} from '../../api/ambassador.service';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AmbassadorActivity() {
  const [activities, setActivities] = useState<AmbassadorActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<AmbassadorActivityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetchAmbassadorActivity();
        if (response.success) {
          // Sort by newest first
          const sorted = [...response.data].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setActivities(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch ambassador activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivity();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesFilter = activeFilter === 'all' || activity.type === activeFilter;
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activities, activeFilter, searchQuery]);

  const getActivityIcon = (type: AmbassadorActivityType) => {
    switch (type) {
      case 'verification':
        return <BadgeCheck className="w-5 h-5 text-role-ambassador" />;
      case 'financial':
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      case 'dispute':
        return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case 'onboarding':
        return <Rocket className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: AmbassadorActivityType) => {
    switch (type) {
      case 'verification':
        return 'bg-role-ambassador/10 border-role-ambassador/20';
      case 'financial':
        return 'bg-emerald-50 border-emerald-100';
      case 'dispute':
        return 'bg-destructive/10 border-destructive/20';
      case 'onboarding':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 pb-[env(safe-area-inset-bottom,20px)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md pt-2 pb-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-foreground">Activity Log</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Professional Record</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-role-ambassador/10 flex items-center justify-center">
            <History className="w-5 h-5 text-role-ambassador" />
          </div>
        </div>

        {/* Search & Quick Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search actions, property names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-muted/50 border-border rounded-xl text-sm focus:ring-2 focus:ring-role-ambassador transition-all outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
            {[
              { id: 'all', label: 'All', icon: Filter },
              { id: 'verification', label: 'Audits', icon: BadgeCheck },
              { id: 'financial', label: 'Earnings', icon: Wallet },
              { id: 'dispute', label: 'Disputes', icon: ShieldAlert },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as AmbassadorActivityType | 'all')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border shrink-0',
                  activeFilter === filter.id 
                    ? 'bg-role-ambassador border-role-ambassador text-white shadow-lg shadow-role-ambassador/20' 
                    : 'bg-card border-border text-muted-foreground hover:bg-muted active:scale-95'
                )}
              >
                <filter.icon className="w-3.5 h-3.5" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-role-ambassador animate-spin mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Retrieving professional logs...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 opacity-30">
              <History className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No activities found</h3>
            <p className="text-sm text-muted-foreground mt-2 border-t pt-4">
              Try adjusting your filters or keep auditing to build your record.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'p-4 rounded-2xl border transition-all relative overflow-hidden',
                    getActivityColor(event.type)
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-border/50">
                      {getActivityIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-black text-foreground text-sm uppercase tracking-tight">{event.title}</h4>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {format(new Date(event.timestamp), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                      
                      {event.metadata && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.metadata.listingDisplayId && (
                            <span className="bg-white/50 border border-border/50 px-2 py-0.5 rounded-lg text-[10px] font-mono text-muted-foreground">
                              {event.metadata.listingDisplayId}
                            </span>
                          )}
                          {event.type === 'financial' && event.metadata.amount && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-black">
                              +₦{(event.metadata.amount).toLocaleString()}
                            </span>
                          )}
                          {event.type === 'dispute' && (
                            <span className="bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              RE-VERIFICATION REQUIRED
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative timeline line */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-current opacity-10" />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* End of list indicator */}
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground/30">
              <div className="h-px w-10 bg-current" />
              <CheckCircle2 className="w-4 h-4" />
              <div className="h-px w-10 bg-current" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
