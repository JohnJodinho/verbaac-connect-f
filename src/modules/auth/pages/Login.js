import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Get the page user was trying to access before login
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true }); // Redirect to intended page or dashboard
        }
        catch (error) {
            console.error('Login failed:', error);
            // Error is already handled in the AuthContext
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-gray-900", children: "Sign in to your account" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Or", ' ', _jsx(Link, { to: "/register", className: "font-medium text-blue-600 hover:text-blue-500", children: "create a new account" })] })] }), _jsx("div", { className: "mt-8", children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsx("div", { className: "mt-1", children: _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "password", name: "password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", required: true, value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm pr-10" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-4 w-4 text-gray-400" })) : (_jsx(Eye, { className: "h-4 w-4 text-gray-400" })) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Remember me" })] }), _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/forgot-password", className: "font-medium text-blue-600 hover:text-blue-500", children: "Forgot your password?" }) })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isLoading, className: "flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Signing in...' : 'Sign in' }) })] }) })] }));
}
