import { motion } from 'framer-motion';
import { PageWrapper, AnimatedCard, AnimatedButton } from '@/components/animated';

export default function Messages() {
  return (
    <PageWrapper className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Messages
          </h1>
          <p className="text-gray-600 mb-8">
            Communicate with landlords, sellers, and potential roommates
          </p>
        </motion.div>
        
        <AnimatedCard className="text-center p-12">
          <motion.div 
            className="text-6xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut' 
            }}
          >
            💬
          </motion.div>
          <motion.h2 
            className="text-xl font-semibold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No messages yet
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-6"
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
          >
            <AnimatedButton>
              Browse Listings
            </AnimatedButton>
          </motion.div>
        </AnimatedCard>
      </div>
    </PageWrapper>
  );
}
