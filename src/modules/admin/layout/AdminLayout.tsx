import { Outlet, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, LayoutDashboard, Users, FileText, Gavel, 
  Settings, LogOut, Wallet, Map, ShieldCheck, UserCog, 
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DesktopGuard from '@/components/shared/DesktopGuard';

export default function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <DesktopGuard>
      <div className="min-h-screen bg-zinc-50 flex font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col fixed inset-y-0 left-0 border-r border-zinc-800 z-50">
          {/* Header */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-800">
            <span className="text-white font-bold tracking-tight text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Verbacc Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
             <SidebarItem 
               icon={LayoutDashboard} 
               label="Overview" 
               href="/dashboard/admin" 
               active={pathname === "/dashboard/admin"} 
             />
             
             <div className="pt-4 pb-2 px-3">
               <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">People</span>
             </div>
             <SidebarItem 
               icon={UserCog} 
               label="Admin Team" 
               href="/dashboard/admin/team" 
               active={pathname.startsWith("/dashboard/admin/team")}
             />
             <SidebarItem 
               icon={Users} 
               label="User Directory" 
               href="/dashboard/admin/users" 
               active={pathname.startsWith("/dashboard/admin/users")}
             />
             <SidebarItem 
               icon={ShieldCheck} 
               label="Trust & Agents" 
               href="/dashboard/admin/trust" 
               active={pathname.startsWith("/dashboard/admin/trust")}
             />

             <div className="pt-4 pb-2 px-3">
               <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Operations</span>
             </div>
             <SidebarItem 
               icon={FileText} 
               label="Verifications" 
               href="/dashboard/admin/verification" 
               active={pathname.startsWith("/dashboard/admin/verification")}
               badge="3" 
             />
             <SidebarItem 
               icon={Gavel} 
               label="Disputes & Escrow" 
               href="/dashboard/admin/disputes" 
               active={pathname.startsWith("/dashboard/admin/disputes")}
               badge="3" 
             />

             <div className="pt-4 pb-2 px-3">
               <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Governance</span>
             </div>
             <SidebarItem 
               icon={Wallet} 
               label="Treasury Hub" 
               href="/dashboard/admin/treasury" 
               active={pathname.startsWith("/dashboard/admin/treasury")}
             />
             <SidebarItem 
               icon={Map} 
               label="Geography Registry" 
               href="/dashboard/admin/registry" 
               active={pathname.startsWith("/dashboard/admin/registry")}
             />
             
             <div className="pt-4 pb-2 px-3">
               <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">System</span>
             </div>
             <SidebarItem 
               icon={Settings} 
               label="Settings" 
               href="/dashboard/admin/settings" 
               active={pathname.startsWith("/dashboard/admin/settings")}
             />
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
             <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-zinc-800/50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
             </button>
             <div className="mt-4 px-3 text-[10px] text-zinc-600">
               <p>Verbacc Admin v1.0.0</p>
               <p>Session ID: ADM-2026-X</p>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen">
           <Outlet />
        </main>
      </div>
    </DesktopGuard>
  );
}

function SidebarItem({ icon: Icon, label, href, active, badge }: { icon: LucideIcon, label: string, href: string, active?: boolean, badge?: string }) {
  return (
    <a 
      href={href}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
        active 
          ? "bg-zinc-800 text-white" 
          : "hover:bg-zinc-800/50 hover:text-gray-300"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", active ? "text-red-500" : "text-zinc-500 group-hover:text-zinc-400")} />
        {label}
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </a>
  );
}
