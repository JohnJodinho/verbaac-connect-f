import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { PageWrapper, AnimatedCard, AnimatedButton } from '../../../components/animated';
export default function Messages() {
    return (_jsx(PageWrapper, { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { className: "text-center mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Messages" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Communicate with landlords, sellers, and potential roommates" })] }), _jsxs(AnimatedCard, { className: "text-center p-12", children: [_jsx(motion.div, { className: "text-6xl mb-4", animate: {
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                            }, transition: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }, children: "\uD83D\uDCAC" }), _jsx(motion.h2, { className: "text-xl font-semibold text-gray-900 mb-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, children: "No messages yet" }), _jsx(motion.p, { className: "text-gray-600 mb-6", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: "Start a conversation by contacting a listing or roommate match." }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: _jsx(AnimatedButton, { children: "Browse Listings" }) })] })] }) }));
}
