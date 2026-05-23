// API Configuration for Website Frontend
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = base.endsWith('/api') ? base : `${base}/api`;
