import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    if (!isAuthenticated) {
        // Redirect to login page with return url
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
