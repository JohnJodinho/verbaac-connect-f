import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedButton, PageWrapper, StaggeredContainer, AnimatedItem } from '../../../components/animated';
import { fieldVariants } from '../../../lib/animations';
import { useAuth } from '../../../hooks/useAuth';
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        studentId: '',
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            const registerData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                university: formData.university,
                studentId: formData.studentId,
            };
            await register(registerData);
            navigate('/dashboard'); // Redirect to dashboard on successful registration
        }
        catch (error) {
            console.error('Registration failed:', error);
            // Error is already handled in the AuthContext
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(PageWrapper, { children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-gray-900", children: "Create your account" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500", children: "Sign in here" })] })] }), _jsx(StaggeredContainer, { className: "mt-8", stagger: 0.1, children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsx(AnimatedItem, { children: _jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx(motion.label, { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 }, children: "First name" }), _jsx("div", { className: "mt-1", children: _jsx(motion.input, { id: "firstName", name: "firstName", type: "text", required: true, value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm", variants: fieldVariants, initial: "initial", whileFocus: "focus", transition: { type: 'spring', stiffness: 300, damping: 20 } }) })] }), _jsxs("div", { children: [_jsx(motion.label, { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.15 }, children: "Last name" }), _jsx("div", { className: "mt-1", children: _jsx(motion.input, { id: "lastName", name: "lastName", type: "text", required: true, value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm", variants: fieldVariants, initial: "initial", whileFocus: "focus", transition: { type: 'spring', stiffness: 300, damping: 20 } }) })] })] }) }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "University email address" }), _jsx("div", { className: "mt-1", children: _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "student@university.edu.ng", className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "university", className: "block text-sm font-medium text-gray-700", children: "University" }), _jsx("div", { className: "mt-1", children: _jsxs("select", { id: "university", name: "university", required: true, value: formData.university, onChange: (e) => setFormData({ ...formData, university: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm", children: [_jsx("option", { value: "", children: "Select your university" }), _jsx("option", { value: "University of Nigeria, Nsukka", children: "University of Nigeria, Nsukka" }), _jsx("option", { value: "University of Ibadan", children: "University of Ibadan" }), _jsx("option", { value: "University of Lagos", children: "University of Lagos" }), _jsx("option", { value: "Ahmadu Bello University", children: "Ahmadu Bello University" }), _jsx("option", { value: "University of Benin", children: "University of Benin" })] }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "studentId", className: "block text-sm font-medium text-gray-700", children: "Student ID" }), _jsx("div", { className: "mt-1", children: _jsx("input", { id: "studentId", name: "studentId", type: "text", required: true, value: formData.studentId, onChange: (e) => setFormData({ ...formData, studentId: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" }) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "password", name: "password", type: showPassword ? 'text' : 'password', autoComplete: "new-password", required: true, value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm pr-10" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-4 w-4 text-gray-400" })) : (_jsx(Eye, { className: "h-4 w-4 text-gray-400" })) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm password" }), _jsx("div", { className: "mt-1", children: _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: "password", autoComplete: "new-password", required: true, value: formData.confirmPassword, onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }), className: "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" }) })] }), _jsx(AnimatedItem, { children: _jsx("div", { children: _jsx(AnimatedButton, { type: "submit", className: "flex w-full justify-center rounded-md border border-transparent py-3 px-4 text-sm font-medium", size: "lg", disabled: isLoading, children: isLoading ? 'Creating account...' : 'Create account' }) }) })] }) })] }));
}
