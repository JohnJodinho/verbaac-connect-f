import { useState, useEffect } from 'react';
import { 
  Map as MapIcon, MapPin, Plus, Loader2, Home, Landmark
} from 'lucide-react';
import { adminService, type Zone, type PropertyType } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function GeographyRegistry() {
  const [activeTab, setActiveTab] = useState<'zones' | 'properties' | 'poi'>('zones');
  const [zones, setZones] = useState<Zone[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newZoneName, setNewZoneName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [zData, pData] = await Promise.all([
       adminService.getZones(),
       adminService.getPropertyTypes()
    ]);
    setZones(zData);
    setProperties(pData);
    setLoading(false);
  };

  const handleAddZone = async () => {
    if (!newZoneName) return;
    await adminService.addZone(newZoneName, 'village'); // Default to village for mock
    setNewZoneName('');
    const zData = await adminService.getZones();
    setZones(zData);
  };

  const handleToggleProperty = async (id: string) => {
    await adminService.togglePropertyType(id);
    const pData = await adminService.getPropertyTypes();
    setProperties(pData);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
       <div className="p-8 pb-4 shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <MapIcon className="w-6 h-6 text-blue-600" /> Geography & Asset Registry
          </h1>
          <p className="text-slate-500 mt-1">Manage platform zones, property types, and verified locations.</p>
       </div>

       {/* Tabs */}
       <div className="px-8 border-b border-slate-200 flex gap-6">
          {[
             { id: 'zones', label: 'Zone Manager', icon: MapPin },
             { id: 'properties', label: 'Property Types', icon: Home },
             { id: 'poi', label: 'Points of Interest', icon: Landmark },
          ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as 'zones' | 'properties' | 'poi')}
               className={cn(
                 "pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors",
                 activeTab === tab.id 
                   ? "border-blue-600 text-blue-600" 
                   : "border-transparent text-slate-500 hover:text-slate-700"
               )}
             >
                <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
          ))}
       </div>

       <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
             <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
             </div>
          ) : (
             <>
                {/* ZONES TAB */}
                {activeTab === 'zones' && (
                   <div className="space-y-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                         <input 
                           value={newZoneName}
                           onChange={(e) => setNewZoneName(e.target.value)}
                           className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="Enter new zone name (e.g. 'Ajah', 'Ikeja GRA')..."
                         />
                         <Button onClick={handleAddZone} className="bg-blue-600 text-white gap-2">
                            <Plus className="w-4 h-4" /> Add Zone
                         </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {zones.map((zone) => (
                            <div key={zone.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                               <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                     <div className={cn(
                                       "w-10 h-10 rounded-lg flex items-center justify-center",
                                       zone.type === 'city' ? "bg-purple-100 text-purple-600" :
                                       zone.type === 'village' ? "bg-emerald-100 text-emerald-600" :
                                       "bg-amber-100 text-amber-600"
                                     )}>
                                        <MapPin className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <h3 className="font-bold text-slate-900">{zone.name}</h3>
                                        <span className="text-xs text-slate-500 capitalize">{zone.type}</span>
                                     </div>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                                        Edit
                                     </Button>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* PROPERTIES TAB */}
                {activeTab === 'properties' && (
                   <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                               <th className="p-4">Property Type</th>
                               <th className="p-4">Category</th>
                               <th className="p-4">Status</th>
                               <th className="p-4 text-right">Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {properties.map((prop) => (
                               <tr key={prop.id} className="hover:bg-slate-50">
                                  <td className="p-4 font-bold text-slate-700">{prop.name}</td>
                                  <td className="p-4">
                                     <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 capitalize">
                                        {prop.category}
                                     </span>
                                  </td>
                                  <td className="p-4">
                                     <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                        prop.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                                     )}>
                                        {prop.is_active ? 'Active' : 'Archived'}
                                     </span>
                                  </td>
                                  <td className="p-4 text-right">
                                     <Button 
                                       size="sm" 
                                       variant={prop.is_active ? "outline" : "default"}
                                       className={cn("text-xs", !prop.is_active && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                                       onClick={() => handleToggleProperty(prop.id)}
                                     >
                                        {prop.is_active ? 'Archive' : 'Activate'}
                                     </Button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                )}

                {/* POI TAB */}
                {activeTab === 'poi' && (
                   <div className="text-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                         <Landmark className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-slate-900">Point of Interest Manager</h3>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                         Map integration coming soon. This module will allow adding hospitals, eateries, and key landmarks.
                      </p>
                      <Button className="mt-6 text-sm" disabled>Initialize Map Engine</Button>
                   </div>
                )}
             </>
          )}
       </div>
    </div>
  );
}
