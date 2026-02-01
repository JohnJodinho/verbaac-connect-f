/**
 * Field Audit Form Page
 * 
 * Data collection engine for physical site visits.
 * Requires GPS proximity confirmation to access.
 * Persists state via useAuditStore for offline robustness.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Camera, 
  Video, 
  ChevronLeft, 
  ShieldCheck,
  Zap,
  Droplets,
  Home,
  Clock,
  Trash2,
  Info,
  BadgeCheck,
  Save,
  Send,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuditStore, type AuditMedia } from '../store/useAuditStore';
import { 
  submitVerificationReport, 
  type VerificationReportSubmission
} from '../../api/ambassador.service';

const RENT_PERIODS = [
  { value: 'yearly', label: 'Per Year' },
  { value: 'semester', label: 'Per Semester' },
];

export default function FieldAuditForm() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  const { 
    activeAudit, 
    updateAudit, 
    toggleAmenity, 
    addMedia, 
    removeMedia, 
    clearAudit,
    lastSavedAt 
  } = useAuditStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'rent' | 'media' | 'confirm'>('checklist');

  // Guard: If no active audit (expired or accessed directly), redirect back to queue
  useEffect(() => {
    if (!activeAudit || activeAudit.taskId !== taskId) {
      navigate('/ambassador/verifications');
    }
  }, [activeAudit, taskId, navigate]);

  if (!activeAudit) return null;

  const handleSaveDraft = () => {
    // Already auto-saved by zustand persist, but we can show feedback
    alert('Progress saved locally.');
  };

  const handleSubmit = async () => {
    // Validation
    if (activeAudit.media.length < 2) {
      alert('Please upload at least 2 photos of the property.');
      setActiveTab('media');
      return;
    }

    if (activeAudit.physicalRentQuote <= 0) {
      alert('Please enter the rent quote verified on-site.');
      setActiveTab('rent');
      return;
    }

    setIsSubmitting(true);
    try {
      const submission: VerificationReportSubmission = {
        taskId: activeAudit.taskId,
        visitedAt: activeAudit.visitedAt,
        checkInGeom: activeAudit.checkInGeom,
        amenitiesConfirmed: activeAudit.amenities.map(a => ({ id: a.id, confirmed: a.confirmed })),
        isRentMatch: activeAudit.isRentMatch,
        physicalRentQuote: activeAudit.physicalRentQuote,
        rentPeriod: activeAudit.rentPeriod,
        isManagerValid: activeAudit.isManagerValid,
        mediaUrls: activeAudit.media.map(m => m.url),
        poiSuggestions: activeAudit.poiSuggestions,
        comments: activeAudit.additionalComments,
      };

      const result = await submitVerificationReport(submission);
      if (result.success) {
        clearAudit();
        navigate('/ambassador/verifications', { state: { success: true, message: result.message } });
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit report. It has been saved to your drafts.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = () => {
    // Simulate photo capture/selection
    const newMedia: AuditMedia = {
      id: Math.random().toString(36).substring(7),
      url: `https://placeholder.com/photo-${activeAudit.media.length + 1}.jpg`,
      type: 'image',
      capturedAt: new Date().toISOString(),
    };
    addMedia(newMedia);
  };

  const handleVideoUpload = () => {
    const newMedia: AuditMedia = {
      id: Math.random().toString(36).substring(7),
      url: `https://placeholder.com/video-tour.mp4`,
      type: 'video',
      capturedAt: new Date().toISOString(),
    };
    addMedia(newMedia);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-[env(safe-area-inset-bottom)]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-muted touch-target"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">Audit: {activeAudit.taskId}</h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              <Clock className="w-3 h-3 text-role-ambassador" />
              <span>Visited: {new Date(activeAudit.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-xs font-medium touch-target hover:bg-muted/80"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>

        {/* Tab Navigation (Horizontal Scrollable) */}
        <div className="flex gap-2 overflow-x-auto mt-4 pb-1 scrollbar-hide">
          {[
            { id: 'checklist', label: 'Checklist', icon: BadgeCheck },
            { id: 'rent', label: 'Rent/Auth', icon: Zap },
            { id: 'media', label: 'Media', icon: Camera },
            { id: 'confirm', label: 'Submit', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'checklist' | 'rent' | 'media' | 'confirm')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap touch-target',
                  activeTab === tab.id 
                    ? 'bg-role-ambassador text-white shadow-lg shadow-role-ambassador/20' 
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'checklist' && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-role-ambassador/5 border border-role-ambassador/20 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-role-ambassador mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Physical Confirmation
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Go around the property and verify each amenity. Do not mark as confirmed if you haven't seen it working.
                </p>
              </div>

              <div className="space-y-3">
                {activeAudit.amenities.map((amenity) => (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left touch-target',
                      amenity.confirmed 
                        ? 'border-role-ambassador/40 bg-role-ambassador/3 shadow-inner' 
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        amenity.confirmed ? 'bg-role-ambassador text-white' : 'bg-role-ambassador/5'
                      )}>
                        {amenity.id === 'water' && <Droplets className="w-5 h-5" />}
                        {amenity.id === 'electricity' && <Zap className="w-5 h-5" />}
                        {amenity.id === 'security' && <ShieldCheck className="w-5 h-5" />}
                        {amenity.id === 'kitchen' && <Home className="w-5 h-5" />}
                        {amenity.id === 'toilet' && <CheckCircle2 className="w-5 h-5 text-current" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{amenity.label}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Status: {amenity.confirmed ? 'Confirmed' : 'Pending Verification'}</p>
                      </div>
                    </div>
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                      amenity.confirmed ? 'bg-role-ambassador border-role-ambassador' : 'border-muted-foreground/30'
                    )}>
                      {amenity.confirmed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rent' && (
            <motion.div
              key="rent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Rent Verification */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold">Rent Verification</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Actual Rent Quote (₦)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter amount given on-site"
                    className="w-full bg-muted border-none rounded-xl p-4 text-lg font-bold focus:ring-2 focus:ring-role-ambassador"
                    value={activeAudit.physicalRentQuote || ''}
                    onChange={(e) => updateAudit({ physicalRentQuote: Number(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {RENT_PERIODS.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => updateAudit({ rentPeriod: period.value as 'yearly' | 'semester' })}
                      className={cn(
                        'p-3 rounded-xl border text-sm font-medium transition-all',
                        activeAudit.rentPeriod === period.value
                          ? 'bg-role-ambassador/10 border-role-ambassador text-role-ambassador'
                          : 'bg-muted border-transparent text-muted-foreground'
                      )}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => updateAudit({ isRentMatch: !activeAudit.isRentMatch })}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-xl border transition-all mt-4',
                    activeAudit.isRentMatch ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700' : 'bg-muted border-transparent'
                  )}
                >
                  <span className="text-sm font-medium">Matches App Price?</span>
                  <div className={cn(
                    'w-10 h-6 rounded-full relative transition-colors',
                    activeAudit.isRentMatch ? 'bg-emerald-500' : 'bg-gray-300'
                  )}>
                    <div className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
                      activeAudit.isRentMatch ? 'right-1' : 'left-1'
                    )} />
                  </div>
                </button>
              </div>

              {/* Identity & Authority */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold">Authority Check</h3>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verify that the person showing you the building has the legal right (Owner) or permission (Agent) to rent it out.
                </p>

                <button
                  onClick={() => updateAudit({ isManagerValid: !activeAudit.isManagerValid })}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
                    activeAudit.isManagerValid ? 'border-blue-500/30 bg-blue-50 text-blue-700' : 'bg-muted border-transparent'
                  )}
                >
                  <span className="text-sm font-medium">Identity Confirmed?</span>
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    activeAudit.isManagerValid ? 'bg-blue-600 border-blue-600' : 'border-muted-foreground/30'
                  )}>
                    {activeAudit.isManagerValid && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </button>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Notes on Authority/Identity</label>
                  <textarea
                    placeholder="e.g. Verified via ID and neighbors"
                    className="w-full bg-muted border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-role-ambassador h-24 resize-none"
                    value={activeAudit.managerNotes || ''}
                    onChange={(e) => updateAudit({ managerNotes: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-amber-800 mb-1 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Live Evidence Only
                </h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Upload at least 2 photos and 1 video tour. High quality visuals increase the listing's trust score.
                </p>
              </div>

              {/* Upload Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handlePhotoUpload}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-muted rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-role-ambassador/40 active:bg-role-ambassador/5 transition-all text-muted-foreground touch-target"
                >
                  <Camera className="w-8 h-8" />
                  <span className="text-xs font-bold">Add Photo</span>
                </button>
                <button 
                  onClick={handleVideoUpload}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-muted rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-role-ambassador/40 active:bg-role-ambassador/5 transition-all text-muted-foreground touch-target"
                >
                  <Video className="w-8 h-8" />
                  <span className="text-xs font-bold">Add Video</span>
                </button>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 gap-3 pb-4">
                {activeAudit.media.map((item) => (
                  <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                    <img 
                      src={item.url} 
                      alt="Captured evidence" 
                      className="w-full h-full object-cover"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <button 
                      onClick={() => removeMedia(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-sm text-[8px] text-white/80 font-mono">
                      {new Date(item.capturedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4 py-8">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                  <Send className="w-10 h-10 text-emerald-600 ml-1" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-emerald-500/20"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <h2 className="text-2xl font-bold">Ready to Submit?</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  You are about to submit the physical audit report for task <span className="font-bold text-foreground">#{activeAudit.taskId}</span>.
                </p>
              </div>

              {/* Audit Summary Card */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amenities Verified</span>
                  <span className="font-bold">{activeAudit.amenities.filter(a => a.confirmed).length}/{activeAudit.amenities.length}</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rent Quoted</span>
                  <span className="font-bold text-emerald-600 text-lg">₦{activeAudit.physicalRentQuote.toLocaleString()}</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Evidence Captured</span>
                  <span className="font-bold">{activeAudit.media.length} items</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  By submitting, you certify that you physically visited the property and the data provided is accurate. Falsification leads to instant de-tiering and role revocation.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-role-ambassador text-white rounded-2xl font-bold text-lg shadow-xl shadow-role-ambassador/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      Submit Audit Report
                    </>
                  )}
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => setActiveTab('checklist')}
                  className="w-full py-3 text-muted-foreground font-medium hover:bg-muted rounded-xl transition-colors"
                >
                  Review Details
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistence Feedback (Mobile Only) */}
      <div className="px-4 py-2 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Draft Active</span>
        </div>
        {lastSavedAt && (
          <span>Saved: {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        )}
      </div>
    </div>
  );
}
