// API Configuration for Website Frontend
const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const PROD_URL = 'https://chillgrand-restaurant-api-1.onrender.com/api';
const LOCAL_URL = 'http://localhost:5000/api';

const base = import.meta.env.VITE_API_URL || (isLocal ? LOCAL_URL : PROD_URL);

// Ensure we don't accidentally bake in localhost into production builds if VITE_API_URL is set locally
const finalBase = (!isLocal && base.includes('localhost')) ? PROD_URL : base;

export const API_BASE_URL = finalBase.endsWith('/api') ? finalBase : `${finalBase}/api`;
