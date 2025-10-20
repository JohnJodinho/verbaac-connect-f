import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Context Providers
import { AuthProvider } from './contexts/AuthContext';
// Route Protection
import ProtectedRoute from './components/ProtectedRoute';
// Layout Components
import { MainLayout } from './layout/MainLayout';
import { AuthLayout } from './layout/AuthLayout';
import { DashboardLayout } from './layout/DashboardLayout';
// Page Components
import Home from './modules/home/pages/Home';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import Housing from './modules/housing/pages/Housing';
import Marketplace from './modules/marketplace/pages/Marketplace';
import Roommates from './modules/roommates/pages/Roommates';
import Agreements from './modules/agreements/pages/Agreements';
import Dashboard from './modules/dashboard/pages/Dashboard';
import Notifications from './modules/notifications/pages/Notifications';
import Messages from './modules/messaging/pages/Messages';
import NotFound from './modules/error-pages/pages/NotFound';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsx("div", { className: "min-h-screen bg-gray-50 transition-colors duration-200", children: _jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(MainLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "housing", element: _jsx(Housing, {}) }), _jsx(Route, { path: "marketplace", element: _jsx(Marketplace, {}) }), _jsx(Route, { path: "roommates", element: _jsx(Roommates, {}) }), _jsx(Route, { path: "agreements", element: _jsx(Agreements, {}) }), _jsx(Route, { path: "notifications", element: _jsx(Notifications, {}) }), _jsx(Route, { path: "messages", element: _jsx(Messages, {}) })] }), _jsxs(Route, { path: "/auth", element: _jsx(AuthLayout, {}), children: [_jsx(Route, { path: "login", element: _jsx(Login, {}) }), _jsx(Route, { path: "register", element: _jsx(Register, {}) })] }), _jsx(Route, { path: "/login", element: _jsx(AuthLayout, {}), children: _jsx(Route, { index: true, element: _jsx(Login, {}) }) }), _jsx(Route, { path: "/register", element: _jsx(AuthLayout, {}), children: _jsx(Route, { index: true, element: _jsx(Register, {}) }) }), _jsxs(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "profile", element: _jsx("div", { children: "Profile Settings" }) }), _jsx(Route, { path: "security", element: _jsx("div", { children: "Security Settings" }) }), _jsx(Route, { path: "activity", element: _jsx("div", { children: "Activity Log" }) }), _jsx(Route, { path: "wallet", element: _jsx("div", { children: "Wallet" }) }), _jsx(Route, { path: "rewards", element: _jsx("div", { children: "Rewards" }) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }) }));
}
export default App;
