import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { PageWrapper, AnimatedCard, AnimatedButton } from '../../../components/animated';
export default function Roommates() {
    return (_jsx(PageWrapper, { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { className: "text-center mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Roommate Matching" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Find compatible roommates based on your lifestyle preferences" })] }), _jsxs(AnimatedCard, { className: "text-center p-12", children: [_jsx(motion.div, { className: "text-6xl mb-4", animate: {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }, transition: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: 'reverse'
                            }, children: "\uD83E\uDD1D" }), _jsx(motion.h2, { className: "text-xl font-semibold text-gray-900 mb-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, children: "Coming Soon" }), _jsx(motion.p, { className: "text-gray-600 mb-6", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: "Our intelligent roommate matching system will help you find the perfect living companion." }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: _jsx(AnimatedButton, { children: "Get Notified When Ready" }) })] })] }) }));
}
