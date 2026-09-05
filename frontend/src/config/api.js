// Centralized API & Socket.IO Configuration for Website Frontend

const getHostname = () => {
    if (typeof window !== 'undefined') return window.location.hostname;
    return 'localhost';
};

const hostname = getHostname();

// Primary HTTP API Base URL (Default: http://localhost:5000/api)
const defaultApiUrl = `http://${hostname}:5000/api`;
const envApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const rawApiUrl = envApiUrl || defaultApiUrl;

// Normalize to ensure exactly one trailing '/api'
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

// Socket.IO Server URL (Default: http://localhost:5000)
// Uses VITE_SOCKET_URL if defined, otherwise strips '/api' from API_BASE_URL
const envSocketUrl = import.meta.env.VITE_SOCKET_URL;
export const SOCKET_URL = envSocketUrl
    ? envSocketUrl.replace(/\/+$/, '')
    : API_BASE_URL.replace(/\/api\/?$/, '');
