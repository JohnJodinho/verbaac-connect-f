import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { buttonVariants, cardVariants, iconVariants } from '../../lib/animations';
export function AnimatedButton({ children, variant = 'primary', size = 'md', className = '', ...props }) {
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
    return (_jsx(motion.button, { variants: buttonVariants, initial: "initial", whileHover: "hover", whileTap: "tap", className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, ...props, children: children }));
}
export function AnimatedCard({ children, hover = true, className = '', ...props }) {
    return (_jsx(motion.div, { variants: cardVariants, initial: "initial", animate: "animate", whileHover: hover ? "hover" : undefined, whileTap: hover ? "tap" : undefined, className: `bg-white rounded-lg shadow-sm border border-gray-200 ${className}`, ...props, children: children }));
}
export function AnimatedIcon({ children, hover = true, className = '', ...props }) {
    return (_jsx(motion.div, { variants: iconVariants, initial: "initial", whileHover: hover ? "hover" : undefined, whileTap: hover ? "tap" : undefined, className: `inline-flex items-center justify-center ${className}`, ...props, children: children }));
}
export function PageWrapper({ children, className = '' }) {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        }, className: className, children: children }));
}
export function StaggeredContainer({ children, stagger = 0.1, className = '', ...props }) {
    return (_jsx(motion.div, { initial: "initial", animate: "animate", variants: {
            initial: {},
            animate: {
                transition: {
                    staggerChildren: stagger,
                },
            },
        }, className: className, ...props, children: children }));
}
export function AnimatedItem({ children, className = '', ...props }) {
    return (_jsx(motion.div, { variants: {
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
        }, className: className, ...props, children: children }));
}
export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }) {
    return (_jsx(motion.div, { animate: {
            opacity: [0.6, 1, 0.6],
        }, transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        }, className: `bg-gray-200 rounded ${width} ${height} ${className}` }));
}
export function FloatingButton({ children, className = '', ...props }) {
    return (_jsx(motion.button, { initial: { scale: 0 }, animate: { scale: 1 }, whileHover: {
            scale: 1.1,
            transition: { type: 'spring', stiffness: 400, damping: 10 }
        }, whileTap: { scale: 0.9 }, className: `fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center ${className}`, ...props, children: children }));
}
// Export all loading components
export { LoadingSpinner, DotsLoader, SkeletonCard, PageLoader, Toast, FloatingHearts } from './LoadingComponents';
