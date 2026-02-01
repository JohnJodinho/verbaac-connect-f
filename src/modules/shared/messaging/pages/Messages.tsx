import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { AnimatedButton, AnimatedCard } from '@/components/animated';

export default function Messages() {
  const navigate = useNavigate();
  
  return (
    <div className="theme-consumer">
      {/* Page Header - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Messages</h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                Chat with landlords, sellers & roommates
              </p>
            </div>
          </div>
          
          {/* Search Button - Mobile */}
          <button className="md:hidden p-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors touch-target">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Empty State - Full-screen feel on mobile */}
      <AnimatedCard className="text-center p-8 md:p-12">
        <motion.div 
          className="text-5xl md:text-6xl mb-4"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' 
          }}
        >
          💬
        </motion.div>
        
        <motion.h2 
          className="text-lg md:text-xl font-semibold text-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No messages yet
        </motion.h2>
        
        <motion.p 
          className="text-sm md:text-base text-muted-foreground mb-6 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Start a conversation by contacting a listing or roommate match.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <AnimatedButton 
            variant="primary"
            className="touch-target"
            onClick={() => navigate('/housing')}
          >
            Browse Housing
          </AnimatedButton>
          <AnimatedButton 
            variant="outline"
            className="touch-target"
            onClick={() => navigate('/marketplace')}
          >
            Browse Marketplace
          </AnimatedButton>
        </motion.div>
      </AnimatedCard>

      {/* Placeholder Conversation List Structure (for future use) */}
      <div className="hidden mt-4 space-y-2">
        {/* Example conversation item */}
        <button className="w-full flex items-center gap-3 p-3 md:p-4 rounded-xl bg-card border border-border hover:bg-muted active:bg-muted/80 transition-colors touch-target text-left">
          <div className="w-12 h-12 rounded-full bg-muted shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium truncate">Contact Name</span>
              <span className="text-xs text-muted-foreground shrink-0">2m ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">Last message preview...</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </button>
      </div>
    </div>
  );
}
