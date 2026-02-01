import { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Activity, Award, ArrowUp, ArrowDown, 
  MapPin, Image, Loader2
} from 'lucide-react';
import { adminService, type AmbassadorProfile } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AmbassadorTrustHub() {
  const [ambassadors, setAmbassadors] = useState<AmbassadorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAmbassadors();
  }, []);

  const loadAmbassadors = async () => {
    setLoading(true);
    const data = await adminService.getAmbassadors();
    setAmbassadors(data);
    setLoading(false);
  };

  const handleTierChange = async (id: string, newTier: AmbassadorProfile['tier_level']) => {
    await adminService.adjustAmbassadorTier(id, newTier);
    await loadAmbassadors(); // Refresh
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
       {/* Header */}
       <header className="p-8 pb-4 shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ShieldCheck className="w-6 h-6 text-indigo-600" /> Ambassador & Trust Overhead
          </h1>
          <p className="text-slate-500 mt-1">Monitor verification workforce and credibility scores.</p>
       </header>

       <div className="flex-1 overflow-y-auto p-8 pt-0 flex flex-col gap-8">
          
          {/* Main Grid */}
          <div className="flex gap-6 flex-col xl:flex-row">
             
             {/* Left: Ambassador List */}
             <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-slate-700 flex items-center gap-2">
                         <UserCheck className="w-4 h-4" /> Active Workforce
                      </h3>
                      <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded-full text-slate-600">
                         {ambassadors.length} Agents
                      </span>
                   </div>
                   
                   <div className="divide-y divide-slate-100">
                      {loading ? (
                         <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                      ) : ambassadors.map((amb) => (
                         <div key={amb.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                  {amb.full_name.charAt(0)}
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-900 text-sm">{amb.full_name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className={cn(
                                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border",
                                        amb.tier_level === 'elite' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                        amb.tier_level === 'verified' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        "bg-slate-50 text-slate-600 border-slate-200"
                                     )}>
                                        {amb.tier_level}
                                     </span>
                                     <span className="text-xs text-slate-400">•</span>
                                     <span className="text-xs text-slate-500">{amb.total_gigs} Gigs</span>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center gap-6">
                               {/* Credibility Score */}
                               <div className="text-right">
                                  <div className="text-xs font-bold text-slate-400 uppercase">Trust Score</div>
                                  <div className={cn(
                                     "font-bold text-lg",
                                     amb.credibility_score > 90 ? "text-emerald-600" : 
                                     amb.credibility_score > 70 ? "text-amber-600" : "text-red-600"
                                  )}>
                                     {amb.credibility_score}%
                                  </div>
                               </div>

                               {/* Actions */}
                               <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  {amb.tier_level !== 'elite' && (
                                     <button 
                                        onClick={() => handleTierChange(amb.id, 'elite')}
                                        className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors" 
                                        title="Promote to Elite"
                                     >
                                        <ArrowUp className="w-4 h-4" />
                                     </button>
                                  )}
                                  {amb.tier_level !== 'novice' && (
                                     <button 
                                        onClick={() => handleTierChange(amb.id, 'novice')}
                                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                        title="Demote to Novice"
                                     >
                                        <ArrowDown className="w-4 h-4" />
                                     </button>
                                  )}
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right: Confidence Audit (Mock) */}
             <div className="w-full xl:w-96 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                   <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-orange-500" /> Confidence Audit Tracker
                   </h3>
                   <div className="space-y-4">
                      {/* Audit Item 1 */}
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase">Low Match</span>
                            <span className="text-xs text-red-400">2 min ago</span>
                         </div>
                         <p className="text-xs font-medium text-slate-700 mb-2">
                            GPS <code>6.45, 3.12</code> deviates &gt;500m from Building Geofence.
                         </p>
                         <div className="flex gap-2">
                            <div className="h-16 w-1/2 bg-slate-200 rounded overflow-hidden relative">
                               <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-bold bg-slate-300/50">
                                  <MapPin className="w-3 h-3 mr-1" /> Expected
                               </div>
                            </div>
                            <div className="h-16 w-1/2 bg-slate-200 rounded overflow-hidden relative">
                               <div className="absolute inset-0 flex items-center justify-center text-[10px] text-red-500 font-bold bg-red-100/50">
                                  <MapPin className="w-3 h-3 mr-1" /> Actual
                               </div>
                            </div>
                         </div>
                         <Button size="sm" variant="outline" className="w-full mt-3 text-xs bg-white h-7">Investigate Agent</Button>
                      </div>

                      {/* Audit Item 2 */}
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Blurry Media</span>
                            <span className="text-xs text-amber-400">1 hr ago</span>
                         </div>
                         <p className="text-xs font-medium text-slate-700 mb-2">
                            Living room scan failed sharpness threshold (0.42).
                         </p>
                         <div className="h-16 w-full bg-slate-200 rounded overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                               <Image className="w-4 h-4 mr-2" /> 2 Failed Images
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-indigo-900 rounded-xl p-6 text-white text-center">
                   <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                   <div className="text-2xl font-bold">128</div>
                   <div className="text-xs text-indigo-200 uppercase tracking-widest font-medium">Successful Verifications Today</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
