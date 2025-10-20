import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Filter, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedButton, AnimatedIcon, PageWrapper, StaggeredContainer, AnimatedItem, FloatingButton } from '../../../components/animated';
export default function Marketplace() {
    const [searchQuery, setSearchQuery] = useState('');
    const mockItems = [
        {
            id: '1',
            title: 'MacBook Pro 13" (2020)',
            description: 'Excellent condition, barely used. Perfect for students.',
            price: 450000,
            originalPrice: 650000,
            images: ['/api/placeholder/300/300'],
            condition: 'like-new',
            category: 'Electronics',
            seller: 'Chidi Okonkwo',
            university: 'University of Lagos',
            rating: 4.8,
            location: 'Yaba, Lagos',
            postedAt: '2 days ago',
            tags: ['laptop', 'apple', 'macbook'],
        },
        {
            id: '2',
            title: 'Textbook Bundle - Engineering',
            description: 'Complete set of engineering textbooks for 200-300 level.',
            price: 25000,
            images: ['/api/placeholder/300/300'],
            condition: 'good',
            category: 'Books',
            seller: 'Amina Hassan',
            university: 'University of Nigeria, Nsukka',
            rating: 4.5,
            location: 'Nsukka, Enugu',
            postedAt: '1 week ago',
            tags: ['textbooks', 'engineering', 'academics'],
        },
    ];
    const categories = [
        'All Categories',
        'Electronics',
        'Books',
        'Furniture',
        'Clothing',
        'Kitchen Items',
        'Sports Equipment',
    ];
    return (_jsx(PageWrapper, { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(motion.div, { className: "mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Student Marketplace" }), _jsx("p", { className: "text-gray-600", children: "Buy and sell second-hand items with fellow students" })] }), _jsxs(AnimatedCard, { className: "p-6 mb-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-4 mb-6", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx(AnimatedIcon, { children: _jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }) }), _jsx(motion.input, { type: "text", placeholder: "Search for items...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", whileFocus: { scale: 1.02 }, transition: { type: 'spring', stiffness: 300, damping: 20 } })] }) }), _jsxs(AnimatedButton, { variant: "secondary", className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5" }), "Filters"] })] }), _jsx(motion.div, { className: "flex flex-wrap gap-2", initial: "initial", animate: "animate", variants: {
                                initial: {},
                                animate: {
                                    transition: {
                                        staggerChildren: 0.05,
                                    },
                                },
                            }, children: categories.map((category) => (_jsx(motion.div, { variants: {
                                    initial: { opacity: 0, scale: 0.8 },
                                    animate: { opacity: 1, scale: 1 },
                                }, children: _jsx(AnimatedButton, { variant: "ghost", size: "sm", className: "px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors", children: category }) }, category))) })] }), _jsx(StaggeredContainer, { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", stagger: 0.1, children: mockItems.map((item) => (_jsx(AnimatedItem, { children: _jsxs(AnimatedCard, { className: "overflow-hidden", children: [_jsxs("div", { className: "relative", children: [_jsx(motion.img, { src: item.images[0], alt: item.title, className: "w-full h-48 object-cover", whileHover: { scale: 1.05 }, transition: { duration: 0.3 } }), _jsx(motion.button, { className: "absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm", whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, children: _jsx(AnimatedIcon, { children: _jsx(Heart, { className: "h-4 w-4 text-gray-400" }) }) }), _jsx(motion.div, { className: "absolute bottom-2 left-2", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: _jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: item.condition }) })] }), _jsxs("div", { className: "p-4", children: [_jsx(motion.h3, { className: "font-semibold text-gray-900 mb-2 line-clamp-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, children: item.title }), _jsxs(motion.div, { className: "flex items-center gap-2 mb-2", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: [_jsxs("span", { className: "text-lg font-bold text-blue-600", children: ["\u20A6", item.price.toLocaleString()] }), item.originalPrice && (_jsxs("span", { className: "text-sm text-gray-500 line-through", children: ["\u20A6", item.originalPrice.toLocaleString()] }))] }), _jsx(motion.p, { className: "text-sm text-gray-600 mb-3 line-clamp-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: item.description }), _jsxs(motion.div, { className: "flex items-center justify-between text-xs text-gray-500 mb-3", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, children: [_jsx("span", { children: item.seller }), _jsxs("div", { className: "flex items-center", children: [_jsx(Star, { className: "h-3 w-3 text-yellow-400 fill-current mr-1" }), item.rating] })] }), _jsxs(motion.div, { className: "flex gap-2", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, children: [_jsx(AnimatedButton, { size: "sm", className: "flex-1", children: "View Details" }), _jsx(AnimatedButton, { variant: "secondary", size: "sm", children: "Chat" })] })] })] }) }, item.id))) }), _jsx(FloatingButton, { children: _jsx("span", { className: "text-2xl", children: "+" }) })] }) }));
}
