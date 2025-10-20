import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Shield, Activity, Wallet, Gift, LogOut, Bell, MessageCircle } from 'lucide-react';
import { AnimatedIcon } from '../components/animated';
const sidebarNavigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Security', href: '/dashboard/security', icon: Shield },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
];
export function DashboardLayout() {
    const location = useLocation();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("nav", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx(Link, { to: "/", className: "text-2xl font-bold text-blue-600", children: "Verbaac Connect" }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(AnimatedIcon, { children: _jsx(Link, { to: "/notifications", className: "text-gray-400 hover:text-gray-500 transition-colors", children: _jsx(Bell, { className: "h-6 w-6" }) }) }), _jsx(AnimatedIcon, { children: _jsx(Link, { to: "/messages", className: "text-gray-400 hover:text-gray-500 transition-colors", children: _jsx(MessageCircle, { className: "h-6 w-6" }) }) }), _jsx(AnimatedIcon, { children: _jsx("button", { className: "text-gray-400 hover:text-gray-500 transition-colors", children: _jsx(LogOut, { className: "h-6 w-6" }) }) })] })] }) }) }), _jsxs("div", { className: "flex", children: [_jsx(motion.aside, { className: "w-64 min-h-screen bg-white shadow-sm border-r border-gray-200", initial: { x: -250, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, children: _jsx("nav", { className: "mt-8 px-4", children: _jsx(motion.ul, { className: "space-y-2", initial: "initial", animate: "animate", variants: {
                                    initial: {},
                                    animate: {
                                        transition: {
                                            staggerChildren: 0.1,
                                        },
                                    },
                                }, children: sidebarNavigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (_jsx(motion.li, { variants: {
                                            initial: { opacity: 0, x: -20 },
                                            animate: { opacity: 1, x: 0 },
                                        }, children: _jsxs(Link, { to: item.href, className: `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`, children: [_jsx(AnimatedIcon, { hover: !isActive, children: _jsx(item.icon, { className: `mr-3 h-5 w-5 ${isActive
                                                            ? 'text-blue-500'
                                                            : 'text-gray-400 group-hover:text-gray-500'}` }) }), item.name] }) }, item.name));
                                }) }) }) }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.main, { className: "flex-1 p-8", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 30
                            }, children: _jsx(Outlet, {}) }) })] })] }));
}
