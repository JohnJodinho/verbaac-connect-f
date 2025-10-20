import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
export function MainLayout() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Navbar, {}), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.main, { className: "flex-1", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4
                    }, children: _jsx(Outlet, {}) }) }), _jsx(Footer, {})] }));
}
