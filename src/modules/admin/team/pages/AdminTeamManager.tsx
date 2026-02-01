import { useState, useEffect } from 'react';
import { 
  Users, Shield, Lock, Plus, CheckCircle2,
  AlertTriangle, Settings, Loader2
} from 'lucide-react';
import { adminService, type AdminProfile } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AdminTeamManager() {
  const [team, setTeam] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPermissions, setEditingPermissions] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<AdminProfile['permissions'] | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setLoading(true);
    const data = await adminService.getAdminTeam();
    setTeam(data);
    setLoading(false);
  };

  const handlePermissionToggle = (key: keyof AdminProfile['permissions']) => {
    if (!tempPermissions) return;
    setTempPermissions(prev => prev ? ({ ...prev, [key]: !prev[key] }) : null);
  };

  const savePermissions = async (id: string) => {
    if (!tempPermissions) return;
    await adminService.updateAdminPermissions(id, tempPermissions);
    
    // Optimistic Update
    setTeam(prev => prev.map(admin => 
      admin.id === id ? { ...admin, permissions: tempPermissions } : admin
    ));
    setEditingPermissions(null);
    setTempPermissions(null);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col p-8 overflow-y-auto">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <Shield className="w-6 h-6 text-indigo-600" /> Admin Team Registry
            </h1>
            <p className="text-slate-500 mt-1">Manage internal staff roles and global permissions.</p>
          </div>
          <Button onClick={() => setIsInviteOpen(true)} className="bg-slate-900 text-white gap-2">
             <Plus className="w-4 h-4" /> Invite New Admin
          </Button>
       </div>

       {loading ? (
          <div className="flex-1 flex justify-center items-center">
             <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          </div>
       ) : (
          <div className="grid gap-4">
             {team.map((admin) => (
                <div key={admin.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                           admin.admin_level === 'super' ? "bg-indigo-100 text-indigo-600" :
                           admin.admin_level === 'finance' ? "bg-emerald-100 text-emerald-600" :
                           "bg-slate-100 text-slate-600"
                         )}>
                            {admin.full_name.charAt(0)}
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900">{admin.full_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{admin.display_id}</span>
                               <span className="text-xs text-slate-400">•</span>
                               <span className="text-xs text-slate-500">{admin.email}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <span className={cn(
                           "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                           admin.admin_level === 'super' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                           admin.admin_level === 'finance' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                           "bg-slate-50 text-slate-700 border-slate-200"
                         )}>
                            {admin.admin_level}
                         </span>
                         
                         {editingPermissions === admin.id ? (
                            <div className="flex gap-2">
                               <Button variant="outline" size="sm" onClick={() => setEditingPermissions(null)}>Cancel</Button>
                               <Button size="sm" className="bg-indigo-600 text-white" onClick={() => savePermissions(admin.id)}>Save</Button>
                            </div>
                         ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-indigo-600"
                              onClick={() => {
                                 setEditingPermissions(admin.id);
                                 setTempPermissions(admin.permissions);
                              }}
                            >
                               <Settings className="w-4 h-4" />
                            </Button>
                         )}
                      </div>
                   </div>

                   {/* Permission Matrix */}
                   <div className="mt-6 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Capabilities & Access</h4>
                      <div className="grid grid-cols-4 gap-4">
                         {[
                           { key: 'can_ban_users', label: 'User Ban Rights', icon: AlertTriangle },
                           { key: 'can_resolve_disputes', label: 'Resolve Disputes', icon: CheckCircle2 },
                           { key: 'can_manage_team', label: 'Team Manager', icon: Users },
                           { key: 'can_view_financials', label: 'Financial View', icon: Lock }
                         ].map((perm) => (
                            <div 
                              key={perm.key}
                              onClick={() => editingPermissions === admin.id && handlePermissionToggle(perm.key as keyof AdminProfile['permissions'])}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                editingPermissions === admin.id ? "cursor-pointer hover:border-indigo-300" : "opacity-75",
                                (editingPermissions === admin.id ? tempPermissions : admin.permissions)?.[perm.key as keyof AdminProfile['permissions']]
                                  ? "bg-slate-50 border-slate-200"
                                  : "bg-slate-50/50 border-transparent opacity-50 grayscale"
                              )}
                            >
                               <div className={cn(
                                  "w-8 h-8 rounded flex items-center justify-center",
                                  (editingPermissions === admin.id ? tempPermissions : admin.permissions)?.[perm.key as keyof AdminProfile['permissions']]
                                     ? "bg-white shadow-sm text-indigo-600"
                                     : "bg-slate-100 text-slate-400"
                               )}>
                                  <perm.icon className="w-4 h-4" />
                               </div>
                               <div>
                                  <span className="text-xs font-bold text-slate-900 block">{perm.label}</span>
                                  <span className="text-[10px] text-slate-500 uppercase">
                                     {(editingPermissions === admin.id ? tempPermissions : admin.permissions)?.[perm.key as keyof AdminProfile['permissions']]
                                        ? 'Active' : 'Revoked'}
                                  </span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}

       {/* Invite Modal Mock */}
       {isInviteOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Invite Team Member</h2>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">Email Address</label>
                      <input type="email" placeholder="colleague@verbaac.com" className="w-full p-2 border rounded-lg text-sm" />
                   </div>
                   <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
                      An invitation link will be sent to this email. The user must complete 2FA setup.
                   </div>
                   <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                      <Button className="flex-1 bg-slate-900 text-white" onClick={() => setIsInviteOpen(false)}>Send Invite</Button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
