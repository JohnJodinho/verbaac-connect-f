import { useState, useEffect } from 'react';
import { 
  Users, Search, ShieldAlert, Power, 
  Home, User, AlertOctagon, Loader2
} from 'lucide-react';
import { adminService, type GlobalUser } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function GlobalUserDirectory() {
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await adminService.getGlobalUsers();
    setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.display_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (userId: string, status: 'active' | 'banned') => {
    if (!confirm(`Are you sure you want to ${status === 'banned' ? 'BAN' : 'ACTIVATE'} this user?`)) return;
    
    await adminService.updateUserStatus(userId, status);
    
    // Optimistic
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status } : null);
    }
  };

  const togglePersona = async (userId: string, persona: 'landlord' | 'agent' | 'seller', currentState: boolean) => {
    await adminService.togglePersonaStatus(userId, persona, !currentState);
    
    // Optimistic
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return {
        ...u,
        personas: {
          ...u.personas,
          [persona]: { ...u.personas[persona], is_active: !currentState }
        }
      };
    }));
    
    // Update selected if open
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => {
         if (!prev) return null;
         return {
           ...prev,
           personas: {
             ...prev.personas,
             [persona]: { ...prev.personas[persona], is_active: !currentState }
           }
         };
      });
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col p-8 overflow-hidden">
       {/* Header */}
       <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" /> Global User Directory
             </h1>
             <p className="text-slate-500 mt-1">Unified view of all platform identities.</p>
          </div>
          <div className="relative w-96">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by Name, Email, or Persona ID..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
       </div>

       <div className="flex-1 flex gap-6 overflow-hidden">
          {/* User List */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Results ({filteredUsers.length})</span>
             </div>
             
             <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase">
                      <tr>
                         <th className="p-4">Identity</th>
                         <th className="p-4">Status</th>
                         <th className="p-4">Unlocked Personas</th>
                         <th className="p-4">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {loading ? (
                         <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-300" /></td></tr>
                      ) : filteredUsers.map((user) => (
                         <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                     {user.full_name.charAt(0)}
                                  </div>
                                  <div>
                                     <div className="font-bold text-slate-900 text-sm">{user.full_name}</div>
                                     <div className="text-xs text-slate-500">{user.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="p-4">
                               <span className={cn(
                                 "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                 user.status === 'active' ? "bg-emerald-50 text-emerald-700" :
                                 user.status === 'banned' ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-500"
                               )}>
                                  {user.status}
                               </span>
                            </td>
                            <td className="p-4">
                               <div className="flex gap-1">
                                  {user.unlocked_roles.map(role => (
                                     <span key={role} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-600 capitalize">
                                        {role}
                                     </span>
                                  ))}
                               </div>
                            </td>
                            <td className="p-4">
                               <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-50" onClick={() => setSelectedUser(user)}>
                                  Manage
                               </Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Deep Dive Panel */}
          {selectedUser && (
             <div className="w-[400px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
                         {selectedUser.full_name.charAt(0)}
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-mono text-slate-400 block mb-1">User ID: {selectedUser.id}</span>
                         <span className={cn(
                           "px-2 py-1 rounded text-xs font-bold uppercase ml-auto block w-fit",
                           selectedUser.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                         )}>
                            {selectedUser.status}
                         </span>
                      </div>
                   </div>
                   <h2 className="text-xl font-bold text-slate-900">{selectedUser.full_name}</h2>
                   <div className="mt-2 space-y-1 text-sm text-slate-500">
                      <div className="flex justify-between">
                         <span>Email:</span> <span className="text-slate-900">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                         <span>Phone:</span> <span className="text-slate-900">{selectedUser.phone_number}</span>
                      </div>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   {/* Persona Switches */}
                   <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Personas</h3>
                      <div className="space-y-3">
                         {/* Landlord Card */}
                         {selectedUser.personas.landlord && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-purple-100 text-purple-600 rounded">
                                     <Home className="w-4 h-4" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-slate-900 text-sm">Landlord</div>
                                     <div className="text-[10px] text-slate-500">{selectedUser.personas.landlord.display_id}</div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", selectedUser.personas.landlord.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 text-xs"
                                    onClick={() => togglePersona(selectedUser.id, 'landlord', selectedUser.personas.landlord!.is_active)}
                                  >
                                     {selectedUser.personas.landlord.is_active ? 'Suspend' : 'Activate'}
                                  </Button>
                               </div>
                            </div>
                         )}

                         {/* Agent Card */}
                         {selectedUser.personas.agent && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                     <User className="w-4 h-4" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-slate-900 text-sm">Agent</div>
                                     <div className="text-[10px] text-slate-500">{selectedUser.personas.agent.display_id}</div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", selectedUser.personas.agent.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 text-xs"
                                    onClick={() => togglePersona(selectedUser.id, 'agent', selectedUser.personas.agent!.is_active)}
                                  >
                                     {selectedUser.personas.agent.is_active ? 'Suspend' : 'Activate'}
                                  </Button>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Kill Switch Zone */}
                   <div className="pt-6 border-t border-red-100">
                      <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <AlertOctagon className="w-4 h-4" /> Danger Zone
                      </h3>
                      {selectedUser.status === 'banned' ? (
                         <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleStatusChange(selectedUser.id, 'active')}
                         >
                            <ShieldAlert className="w-4 h-4 mr-2" /> Restore User Access
                         </Button>
                      ) : (
                         <Button 
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            onClick={() => handleStatusChange(selectedUser.id, 'banned')}
                         >
                            <Power className="w-4 h-4 mr-2" /> Ban User Permanently
                         </Button>
                      )}
                      <p className="text-[10px] text-slate-400 mt-2 text-center">
                         This action will lock all associated wallets and personas immediately.
                      </p>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
}
