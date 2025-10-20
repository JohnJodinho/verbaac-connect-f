import { clsx } from 'clsx';
export function cn(...inputs) {
    return clsx(inputs);
}
export function formatCurrency(amount, currency = '₦') {
    return `${currency}${amount.toLocaleString()}`;
}
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}
export function formatRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'Just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
}
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
}
export function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function validateNigerianUniversityEmail(email) {
    // Common Nigerian university email domains
    const nigerianUniversityDomains = [
        'unn.edu.ng',
        'ui.edu.ng',
        'unilag.edu.ng',
        'abu.edu.ng',
        'uniben.edu',
        'oauife.edu.ng',
        'futminna.edu.ng',
        'unijos.edu.ng',
        'unical.edu.ng',
        'unimaid.edu.ng',
        // Add more as needed
    ];
    const domain = email.split('@')[1];
    return nigerianUniversityDomains.includes(domain);
}
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
