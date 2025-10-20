import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
// Enhanced Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    return (_jsx(motion.div, { className: `${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full ${className}`, animate: { rotate: 360 }, transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        } }));
}
// Pulsing Dots Loader
export function DotsLoader({ className = '' }) {
    return (_jsx("div", { className: `flex space-x-1 ${className}`, children: [0, 1, 2].map((index) => (_jsx(motion.div, { className: "w-2 h-2 bg-blue-600 rounded-full", animate: {
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
            }, transition: {
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
            } }, index))) }));
}
// Skeleton Card Loader
export function SkeletonCard({ className = '' }) {
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-sm p-6 ${className}`, children: [_jsx(motion.div, { className: "h-4 bg-gray-200 rounded mb-4", animate: { opacity: [0.6, 1, 0.6] }, transition: { duration: 1.5, repeat: Infinity } }), _jsx(motion.div, { className: "h-3 bg-gray-200 rounded mb-2 w-3/4", animate: { opacity: [0.6, 1, 0.6] }, transition: { duration: 1.5, repeat: Infinity, delay: 0.2 } }), _jsx(motion.div, { className: "h-3 bg-gray-200 rounded w-1/2", animate: { opacity: [0.6, 1, 0.6] }, transition: { duration: 1.5, repeat: Infinity, delay: 0.4 } })] }));
}
// Full Page Loader
export function PageLoader() {
    return (_jsx(motion.div, { className: "min-h-screen flex items-center justify-center bg-gray-50", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs("div", { className: "text-center", children: [_jsx(motion.div, { className: "text-4xl font-bold text-blue-600 mb-4", initial: { scale: 0.8 }, animate: { scale: 1 }, transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 20
                    }, children: "Verbaac Connect" }), _jsx(LoadingSpinner, { size: "lg" }), _jsx(motion.p, { className: "text-gray-600 mt-4", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: "Loading your experience..." })] }) }));
}
// Success/Error Toast Animation Component
export function Toast({ message, type = 'success', isVisible, onClose }) {
    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };
    return (_jsx(motion.div, { className: `fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`, initial: { opacity: 0, y: -50, scale: 0.8 }, animate: {
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : -50,
            scale: isVisible ? 1 : 0.8
        }, exit: { opacity: 0, y: -50, scale: 0.8 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, onClick: onClose, children: message }));
}
// Floating Hearts Animation (for likes/favorites)
export function FloatingHearts({ trigger }) {
    return (_jsx(_Fragment, { children: trigger && (_jsx(motion.div, { className: "absolute inset-0 pointer-events-none", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [...Array(5)].map((_, i) => (_jsx(motion.div, { className: "absolute text-red-500 text-xl", initial: {
                    x: Math.random() * 100,
                    y: 50,
                    scale: 0,
                    rotate: 0,
                }, animate: {
                    y: -100,
                    scale: [0, 1, 0],
                    rotate: 360,
                }, transition: {
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'easeOut',
                }, children: "\u2764\uFE0F" }, i))) })) }));
}
