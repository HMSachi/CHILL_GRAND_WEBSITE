import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

let socket = null;

/**
 * Get or initialize the shared Socket.IO connection for Website Frontend.
 * Uses centralized SOCKET_URL resolved from environment configuration.
 * Automatic reconnection enabled with exponential backoff.
 */
export const getSocket = (token) => {
    if (!token) {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        return null;
    }

    if (!socket || socket.auth?.token !== token) {
        if (socket) {
            socket.disconnect();
        }

        socket = io(SOCKET_URL, {
            auth: { token },
            query: { pin: token },
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
            timeout: 20000
        });

        socket.on('connect', () => {
            console.log(`[WEBSOCKET WEBSITE] Connected to ${SOCKET_URL}. Socket ID:`, socket.id);
        });

        socket.on('connect_error', (err) => {
            console.warn('[WEBSOCKET WEBSITE] Connection error:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('[WEBSOCKET WEBSITE] Disconnected:', reason);
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
