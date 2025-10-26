import { motion, type HTMLMotionProps } from 'framer-motion';
import { buttonVariants, cardVariants, iconVariants } from '../../lib/animations';
import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

// --- Base props ---
interface AnimatedButtonBaseProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// --- Props for a <button> ---
// These props are merged with HTMLMotionProps for a button
type AnimatedButtonButtonProps = AnimatedButtonBaseProps & 
  { asChild?: false } & 
  Omit<HTMLMotionProps<'button'>, 'children' | 'className'>;

// --- Props for an <Link> (asChild) ---
// These props are merged with LinkProps.
// The *wrapper* will get the motion props, not the link itself.
type AnimatedButtonLinkProps = AnimatedButtonBaseProps & 
  { asChild: true } & 
  Omit<LinkProps, 'children' | 'className'>;

// Combine them in a discriminated union
type AnimatedButtonProps = AnimatedButtonButtonProps | AnimatedButtonLinkProps;

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  ...props
}: AnimatedButtonProps) {
  
  // Base classes from your theme
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  // Mapped to your index.css theme variables
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm', // Adjusted padding for sm
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // These are the animation props for the wrapper/button
  const motionAnimationProps = {
      variants: buttonVariants,
      initial: "initial",
      whileHover: "hover",
      whileTap: "tap",
  };

  if (asChild) {
      // 'props' must be of type Omit<AnimatedButtonLinkProps, ...baseProps>
      // This type assertion is safe because of the discriminated union
      const linkProps = props as Omit<AnimatedButtonLinkProps, keyof AnimatedButtonBaseProps | 'asChild'>;

      return (
        <motion.div
          {...motionAnimationProps}
          className="inline-flex" // Wrapper div, not styled as button
        >
          <Link
            className={combinedClassName} // The Link gets the styling
            {...linkProps} // Pass all remaining props (like 'to') to Link
          >
            {children}
          </Link>
        </motion.div>
      );
  }

  // 'props' must be of type Omit<AnimatedButtonButtonProps, ...baseProps>
  // This is safe because asChild is false
  const buttonProps = props as Omit<AnimatedButtonButtonProps, keyof AnimatedButtonBaseProps | 'asChild'>;

  return (
    <motion.button
      className={combinedClassName}
      {...motionAnimationProps}
      {...buttonProps} // Pass all remaining motion/button props
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
      className={`bg-card rounded-lg shadow-sm border border-border ${className}`}
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
      className={`bg-muted rounded-lg ${width} ${height} ${className}`}
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
      className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center ${className}`}
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

