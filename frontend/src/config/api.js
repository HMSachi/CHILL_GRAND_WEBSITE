// API Configuration for Website Frontend
const getHostname = () => {
    if (typeof window !== 'undefined') return window.location.hostname;
    return 'localhost';
};

const hostname = getHostname();

// Treat localhost, loopback, local network IPs, and local domains as local environment
const isLocal = typeof window !== 'undefined' && (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.local') ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
);

const PROD_URL = 'https://chillgrand-restaurant-api-1.onrender.com/api';
// Dynamically route to the host server running the frontend so mobile/tablet testing works
const LOCAL_URL = `http://${hostname}:5000/api`;

const base = import.meta.env.VITE_API_URL || (isLocal ? LOCAL_URL : PROD_URL);

// Ensure we don't accidentally bake in localhost into production builds if VITE_API_URL is set locally
const finalBase = (!isLocal && base.includes('localhost')) ? PROD_URL : base;

export const API_BASE_URL = finalBase.endsWith('/api') ? finalBase : `${finalBase}/api`;

