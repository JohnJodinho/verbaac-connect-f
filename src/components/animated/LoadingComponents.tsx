import { motion } from 'framer-motion';

// Enhanced Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// Pulsing Dots Loader
export function DotsLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Skeleton Card Loader
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <motion.div
        className="h-4 bg-gray-200 rounded mb-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-3 bg-gray-200 rounded mb-2 w-3/4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-3 bg-gray-200 rounded w-1/2"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

// Full Page Loader
export function PageLoader() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="text-4xl font-bold text-blue-600 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 20 
          }}
        >
          Verbaac Connect
        </motion.div>
        <LoadingSpinner size="lg" />
        <motion.p
          className="text-gray-600 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading your experience...
        </motion.p>
      </div>
    </motion.div>
  );
}

// Success/Error Toast Animation Component
export function Toast({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose 
}: { 
  message: string; 
  type?: 'success' | 'error' | 'info'; 
  isVisible: boolean; 
  onClose: () => void; 
}) {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <motion.div
      className={`fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`}
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50,
        scale: isVisible ? 1 : 0.8 
      }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={onClose}
    >
      {message}
    </motion.div>
  );
}

// Floating Hearts Animation (for likes/favorites)
export function FloatingHearts({ trigger }: { trigger: boolean }) {
  return (
    <>
      {trigger && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-red-500 text-xl"
              initial={{
                x: Math.random() * 100,
                y: 50,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: -100,
                scale: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            >
              ❤️
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
