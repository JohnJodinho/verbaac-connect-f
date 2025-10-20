import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonVariants, cardVariants, iconVariants } from '../../lib/animations';
import { ReactNode } from 'react';

// Animated Button Component
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: AnimatedButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Animated Card Component
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
}

export function AnimatedCard({ children, hover = true, className = '', ...props }: AnimatedCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={hover ? "hover" : undefined}
      whileTap={hover ? "tap" : undefined}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated Icon Component
interface AnimatedIconProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
}

export function AnimatedIcon({ children, hover = true, className = '', ...props }: AnimatedIconProps) {
  return (
    <motion.div
      variants={iconVariants}
      initial="initial"
      whileHover={hover ? "hover" : undefined}
      whileTap={hover ? "tap" : undefined}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Page Wrapper for Route Transitions
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered Container for Lists/Grids
interface StaggeredContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  stagger?: number;
}

export function StaggeredContainer({ 
  children, 
  stagger = 0.1, 
  className = '', 
  ...props 
}: StaggeredContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated List Item
interface AnimatedItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export function AnimatedItem({ children, className = '', ...props }: AnimatedItemProps) {
  return (
    <motion.div
      variants={{
        initial: {
          opacity: 0,
          y: 20,
        },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Loading Skeleton
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }: SkeletonProps) {
  return (
    <motion.div
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-gray-200 rounded ${width} ${height} ${className}`}
    />
  );
}

// Floating Action Button
interface FloatingButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
}

export function FloatingButton({ children, className = '', ...props }: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ 
        scale: 1.1,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Export all loading components
export { 
  LoadingSpinner, 
  DotsLoader, 
  SkeletonCard, 
  PageLoader, 
  Toast, 
  FloatingHearts 
} from './LoadingComponents';
