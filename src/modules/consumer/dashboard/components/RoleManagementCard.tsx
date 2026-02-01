import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Home, 
  Briefcase, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoleType } from '@/types';

interface RoleConfig {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  href?: string;
}

const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  consumer: {
    name: 'Consumer',
    description: 'Browse housing and marketplace',
    icon: Users,
    color: 'text-role-consumer',
    bgColor: 'bg-role-consumer/10',
  },
  seller: {
    name: 'Seller',
    description: 'Sell items in the marketplace',
    icon: ShoppingBag,
    color: 'text-role-seller',
    bgColor: 'bg-role-seller/10',
  },
  landlord: {
    name: 'Landlord',
    description: 'List and manage properties',
    icon: Home,
    color: 'text-role-landlord',
    bgColor: 'bg-role-landlord/10',
    href: '/landlord/settings',
  },
  agent: {
    name: 'Agent',
    description: 'Manage property portfolios',
    icon: Briefcase,
    color: 'text-role-agent',
    bgColor: 'bg-role-agent/10',
    href: '/agent/settings',
  },
  ambassador: {
    name: 'Ambassador',
    description: 'Verify properties for students',
    icon: Award,
    color: 'text-role-ambassador',
    bgColor: 'bg-role-ambassador/10',
  },
  admin: {
    name: 'Admin',
    description: 'Platform governance',
    icon: Shield,
    color: 'text-role-admin',
    bgColor: 'bg-role-admin/10',
  },
};

const PROFESSIONAL_ROLES: RoleType[] = ['landlord', 'agent', 'ambassador'];

export function RoleManagementCard() {
  const { unlockedRoles } = useAuthStore();

  const unlockedSet = new Set(unlockedRoles);
  const availableProfessionalRoles = PROFESSIONAL_ROLES.filter(
    (role) => !unlockedSet.has(role)
  );

  const hasProfessionalLink = unlockedRoles.some(
    (role) => role === 'landlord' || role === 'agent'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-muted rounded-lg">
          <Shield className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Your Roles</h2>
          <p className="text-sm text-muted-foreground">
            Manage your identities on Verbacc Connect
          </p>
        </div>
        {hasProfessionalLink && (
          <Link
            to="/dashboard/professional-settings"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
            Pro Settings
          </Link>
        )}
      </div>

      {/* Unlocked Roles Grid */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Active Roles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {unlockedRoles.map((role) => {
            const config = ROLE_CONFIGS[role];
            if (!config) return null;
            const Icon = config.icon;
            
            return (
              <div
                key={role}
                className={`flex items-center gap-3 p-3 rounded-xl border border-border ${config.bgColor}`}
              >
                <div className={`p-2 rounded-lg bg-card`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {config.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600">Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Role CTAs */}
      {availableProfessionalRoles.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Expand Your Reach
          </h3>
          <div className="space-y-3">
            {availableProfessionalRoles.map((role) => {
              const config = ROLE_CONFIGS[role];
              if (!config) return null;
              const Icon = config.icon;

              return (
                <Link
                  key={role}
                  to={`/onboarding/${role}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-foreground/20 hover:shadow-sm transition-all group"
                >
                  <div className={`p-3 rounded-xl ${config.bgColor}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Become a {config.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
