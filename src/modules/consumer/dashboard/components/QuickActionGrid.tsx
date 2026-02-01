import { motion } from 'framer-motion';
import { Home, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVisibilityGate } from '@/hooks/useVisibilityGate';

const quickActions = [
  {
    id: 'housing',
    title: 'Find Housing',
    description: 'Discover verified accommodations near your campus',
    shortDesc: 'Verified housing',
    icon: Home,
    href: '/housing',
    color: 'from-teal-500 to-emerald-600',
    hoverColor: 'group-hover:from-teal-600 group-hover:to-emerald-700',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Buy & sell items with secure escrow protection',
    shortDesc: 'Buy & sell items',
    icon: ShoppingBag,
    href: '/marketplace',
    color: 'from-blue-500 to-indigo-600',
    hoverColor: 'group-hover:from-blue-600 group-hover:to-indigo-700',
  },
  {
    id: 'roommates',
    title: 'Find Roommate',
    description: 'Match with compatible students for shared living',
    shortDesc: 'Match roommates',
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
 * 
 * Mobile: 2-column grid with compact cards
 * Desktop: 3-column horizontal row
 */
export function QuickActionGrid() {
  const { canAccessRoommates } = useVisibilityGate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8"
    >
      {quickActions.map((action) => {
        const Icon = action.icon;
        const isLocked = action.requiresStudent && !canAccessRoommates;

        return (
          <motion.div 
            key={action.id} 
            variants={itemVariants}
            // Roommates takes full width on mobile when 3 items
            className={action.id === 'roommates' ? 'col-span-2 md:col-span-1' : ''}
          >
            <Link
              to={isLocked ? '#' : action.href}
              className={`group relative block p-4 md:p-6 rounded-xl md:rounded-2xl bg-linear-to-br ${action.color} ${action.hoverColor}
                         text-white shadow-lg transition-all duration-300 touch-target
                         ${isLocked ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl active:scale-[0.98] md:hover:scale-[1.02]'}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              {isLocked && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 md:py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] md:text-xs font-medium">
                  Students Only
                </div>
              )}

              <div className="flex items-start justify-between mb-2 md:mb-4">
                <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <ArrowRight className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 
                  ${isLocked ? '' : 'group-hover:translate-x-1'}`} 
                />
              </div>

              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">{action.title}</h3>
              {/* Short description on mobile, full on desktop */}
              <p className="text-xs md:text-sm text-white/80 line-clamp-2">
                <span className="md:hidden">{action.shortDesc}</span>
                <span className="hidden md:inline">
                  {isLocked 
                    ? 'Verify your student status to access roommate matching'
                    : action.description
                  }
                </span>
              </p>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent rounded-xl md:rounded-2xl pointer-events-none" />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
