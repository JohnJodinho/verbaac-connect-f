import { motion } from 'framer-motion';
import { Home, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVisibilityGate } from '@/hooks/useVisibilityGate';

const quickActions = [
  {
    id: 'housing',
    title: 'Find Housing',
    description: 'Discover verified accommodations near your campus',
    icon: Home,
    href: '/housing',
    color: 'from-teal-500 to-emerald-600',
    hoverColor: 'group-hover:from-teal-600 group-hover:to-emerald-700',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Buy & sell items with secure escrow protection',
    icon: ShoppingBag,
    href: '/marketplace',
    color: 'from-blue-500 to-indigo-600',
    hoverColor: 'group-hover:from-blue-600 group-hover:to-indigo-700',
  },
  {
    id: 'roommates',
    title: 'Find Roommate',
    description: 'Match with compatible students for shared living',
    icon: Users,
    href: '/roommates',
    color: 'from-purple-500 to-pink-600',
    hoverColor: 'group-hover:from-purple-600 group-hover:to-pink-700',
    requiresStudent: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * QuickActionGrid provides large navigation buttons for core consumer features:
 * Find Housing, Marketplace, and Find Roommate.
 */
export function QuickActionGrid() {
  const { isStudent, canAccessRoommates } = useVisibilityGate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {quickActions.map((action) => {
        const Icon = action.icon;
        const isLocked = action.requiresStudent && !canAccessRoommates;

        return (
          <motion.div key={action.id} variants={itemVariants}>
            <Link
              to={isLocked ? '#' : action.href}
              className={`group relative block p-6 rounded-2xl bg-gradient-to-br ${action.color} ${action.hoverColor}
                         text-white shadow-lg transition-all duration-300 
                         ${isLocked ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              {isLocked && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  Students Only
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRight className={`h-5 w-5 transition-transform duration-300 
                  ${isLocked ? '' : 'group-hover:translate-x-1'}`} 
                />
              </div>

              <h3 className="text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-sm text-white/80">
                {isLocked 
                  ? 'Verify your student status to access roommate matching'
                  : action.description
                }
              </p>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none" />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
