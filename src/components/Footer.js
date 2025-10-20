import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export function Footer() {
    return (_jsx(motion.footer, { className: "bg-gray-50 border-t border-gray-200", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }, children: _jsxs("div", { className: "max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { className: "grid grid-cols-1 md:grid-cols-4 gap-8", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                        staggerChildren: 0.1
                    }, children: [_jsxs(motion.div, { className: "col-span-1 md:col-span-2", variants: {
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }, children: [_jsx(motion.div, { className: "flex items-center", whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 400, damping: 10 }, children: _jsx("span", { className: "text-2xl font-bold text-blue-600", children: "Verbaac Connect" }) }), _jsx("p", { className: "mt-4 text-gray-600 max-w-md", children: "Connecting Nigerian students with housing, roommates, and marketplace opportunities. Building communities, one connection at a time." })] }), _jsxs(motion.div, { variants: {
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }, children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 tracking-wider uppercase", children: "Product" }), _jsx("ul", { className: "mt-4 space-y-4", children: [
                                        { to: "/housing", label: "Housing" },
                                        { to: "/marketplace", label: "Marketplace" },
                                        { to: "/roommates", label: "Roommates" },
                                        { to: "/agreements", label: "Agreements" }
                                    ].map((link) => (_jsx(motion.li, { whileHover: { x: 4 }, transition: { type: 'spring', stiffness: 400, damping: 10 }, children: _jsx(Link, { to: link.to, className: "text-base text-gray-500 hover:text-gray-900 transition-colors", children: link.label }) }, link.to))) })] }), _jsxs(motion.div, { variants: {
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }, children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 tracking-wider uppercase", children: "Support" }), _jsx("ul", { className: "mt-4 space-y-4", children: [
                                        { to: "/about", label: "About" },
                                        { to: "/faq", label: "FAQ" },
                                        { to: "/terms", label: "Terms" },
                                        { to: "/privacy", label: "Privacy" }
                                    ].map((link) => (_jsx(motion.li, { whileHover: { x: 4 }, transition: { type: 'spring', stiffness: 400, damping: 10 }, children: _jsx(Link, { to: link.to, className: "text-base text-gray-500 hover:text-gray-900 transition-colors", children: link.label }) }, link.to))) })] })] }), _jsx(motion.div, { className: "mt-8 border-t border-gray-200 pt-8", initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { delay: 0.3 }, children: _jsx("p", { className: "text-base text-gray-400 text-center", children: "\u00A9 2025 Verbaac Connect. All rights reserved." }) })] }) }));
}
