/**
 * Verification Queue Page
 * 
 * Real-time, mobile-optimized list of housing units awaiting physical audit.
 * 
 * Features:
 * - Proximity filtering by campus and zone
 * - Task cards with priority badges
 * - GPS Gate modal for proximity verification
 * - Filter tabs for status
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BadgeCheck, 
  Filter, 
  MapPin, 
  RefreshCw, 
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  fetchVerificationTasks, 
  fetchAmbassadorProfile,
  ZONE_OPTIONS,
  type VerificationTask, 
  type AmbassadorProfile
} from '../../api/ambassador.service';
import { useNavigate } from 'react-router-dom';
import VerificationTaskCard from '../components/VerificationTaskCard';
import GpsGate from '../components/GpsGate';
import { useAuditStore } from '../store/useAuditStore';

type FilterTab = 'all' | 'pending' | 'assigned' | 'in_progress';

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
];

export default function VerificationQueue() {
  const navigate = useNavigate();
  const startAudit = useAuditStore(state => state.startAudit);
  
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [profile, setProfile] = useState<AmbassadorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [showZoneFilter, setShowZoneFilter] = useState(false);
  
  // GPS Gate state
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(null);
  const [showGpsGate, setShowGpsGate] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load profile first to get campus/zone
      const profileResponse = await fetchAmbassadorProfile();
      if (profileResponse.success) {
        setProfile(profileResponse.data);
        
        // Load tasks filtered by campus
        const tasksResponse = await fetchVerificationTasks(
          profileResponse.data.assignedCampus,
          selectedZone !== 'all' ? selectedZone : undefined
        );
        
        if (tasksResponse.success) {
          setTasks(tasksResponse.data);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load verification tasks');
    } finally {
      setIsLoading(false);
    }
  }, [selectedZone]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const tasksResponse = await fetchVerificationTasks(
        profile?.assignedCampus,
        selectedZone !== 'all' ? selectedZone : undefined
      );
      if (tasksResponse.success) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter tasks by status tab
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === activeTab);
    }
    
    // Sort: high priority first, then by date
    filtered.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return filtered;
  }, [tasks, activeTab]);

  const handleTaskSelect = (task: VerificationTask) => {
    setSelectedTask(task);
    setShowGpsGate(true);
  };

  const handleProximityVerified = (checkInGeom: { lat: number; lng: number }) => {
    if (!selectedTask) return;

    console.log('[VerificationQueue] Proximity verified, initializing audit:', selectedTask.id);
    
    // Initialize persisted audit store
    startAudit(selectedTask.id, checkInGeom);
    
    setShowGpsGate(false);
    const taskId = selectedTask.id;
    setSelectedTask(null);

    // Navigate to field audit form
    navigate(`/dashboard/ambassador/verifications/${taskId}/audit`);
  };

  const handleCancelGpsGate = () => {
    setShowGpsGate(false);
    setSelectedTask(null);
  };

  const handleZoneChange = async (zone: string) => {
    setSelectedZone(zone);
    setShowZoneFilter(false);
    
    // Refetch with new zone filter
    setIsRefreshing(true);
    try {
      const tasksResponse = await fetchVerificationTasks(
        profile?.assignedCampus,
        zone !== 'all' ? zone : undefined
      );
      if (tasksResponse.success) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      console.error('Failed to filter:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-role-ambassador animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading verification queue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to Load Queue</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-role-ambassador text-white rounded-lg font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">Verification Queue</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground whitespace-nowrap">
              <MapPin className="w-4 h-4 text-role-ambassador" />
              <span>{profile?.assignedCampus} • {profile?.currentZone}</span>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 active:bg-muted/70 transition-colors touch-target shrink-0"
            aria-label="Refresh tasks"
          >
            <RefreshCw className={cn(
              'w-5 h-5 text-muted-foreground',
              isRefreshing && 'animate-spin'
            )} />
          </button>
        </div>
      </header>

      {/* Independently Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 pt-4">

      <div className="px-4 md:px-6 space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          {/* Status Tabs */}
          <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors touch-target',
                  activeTab === tab.value
                    ? 'bg-role-ambassador text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Zone Filter */}
          <div className="relative">
            <button
              onClick={() => setShowZoneFilter(!showZoneFilter)}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm touch-target"
            >
              <Filter className="w-4 h-4 text-muted-foreground" />
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                showZoneFilter && 'rotate-180'
              )} />
            </button>

            <AnimatePresence>
              {showZoneFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border border-border shadow-xl z-20 overflow-hidden"
                >
                  <div className="p-2">
                    <button
                      onClick={() => handleZoneChange('all')}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedZone === 'all' 
                          ? 'bg-role-ambassador/10 text-role-ambassador font-medium' 
                          : 'hover:bg-muted'
                      )}
                    >
                      All Zones
                    </button>
                    {ZONE_OPTIONS.map((zone) => (
                      <button
                        key={zone.value}
                        onClick={() => handleZoneChange(zone.value)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          selectedZone === zone.value 
                            ? 'bg-role-ambassador/10 text-role-ambassador font-medium' 
                            : 'hover:bg-muted'
                        )}
                      >
                        {zone.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Task Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BadgeCheck className="w-4 h-4" />
          <span>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} 
            {activeTab !== 'all' && ` (${activeTab.replace('_', ' ')})`}
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Tasks Found</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {activeTab !== 'all' 
                  ? `No ${activeTab.replace('_', ' ')} tasks in your area.`
                  : 'No verification tasks available in your assigned zone.'}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <VerificationTaskCard
                key={task.id}
                task={task}
                onSelect={handleTaskSelect}
                index={index}
              />
            ))
          )}
        </div>
      </div>

      {/* GPS Gate Modal */}
      <AnimatePresence>
        {showGpsGate && selectedTask && (
          <GpsGate
            taskId={selectedTask.id}
            propertyAddress={selectedTask.streetAddress}
            propertyCoords={selectedTask.unitGeom}
            onProximityVerified={handleProximityVerified}
            onCancel={handleCancelGpsGate}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
