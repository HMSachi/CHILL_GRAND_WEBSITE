import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import '../styles/pages/BeverageDashboard.css';
import PortalLoginCard from '../components/portals/PortalLoginCard';
import logo from '../assets/logo.png';
import { API_BASE_URL as BASE } from '../config/api';
import { getSocket } from '../services/socket';

// ─────────────────────────────────────────────────────────────────────────────
// Utility Helpers  (mirrors ChefDashboard.jsx exactly)
// ─────────────────────────────────────────────────────────────────────────────

const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    const str = String(dateStr);
    return (str.includes('T') && !str.endsWith('Z') && !str.includes('+'))
        ? `${str}Z`
        : str;
};

const formatDuration = (ms) => {
    if (ms === null || ms === undefined || isNaN(ms)) return '';
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
};

// ─────────────────────────────────────────────────────────────────────────────
// LiveTimer — identical to KDS version, uses bev-timer-* CSS classes
// ─────────────────────────────────────────────────────────────────────────────

const LiveTimer = ({ placedAtStr, servedAtStr, className = '' }) => {
    const [elapsedStr, setElapsedStr] = useState('');
    const [timerClass, setTimerClass] = useState('bev-timer-ok');

    useEffect(() => {
        if (!placedAtStr) { setElapsedStr(''); return; }

        const calculate = () => {
            const placed = new Date(normalizeDate(placedAtStr));
            const end = servedAtStr ? new Date(normalizeDate(servedAtStr)) : new Date();
            const diffMs = end - placed;
            const total = Math.max(0, Math.floor(diffMs / 1000));
            const mins = Math.floor(total / 60);
            const secs = total % 60;

            let tc = 'bev-timer-ok';
            if (mins >= 5) tc = 'bev-timer-warning';
            if (mins >= 10) tc = 'bev-timer-late';
            setTimerClass(tc);
            return `${mins}m ${secs}s`;
        };

        setElapsedStr(calculate());
        if (servedAtStr) return;
        const iv = setInterval(() => setElapsedStr(calculate()), 1000);
        return () => clearInterval(iv);
    }, [placedAtStr, servedAtStr]);

    return <span className={`${className} ${timerClass}`}>{elapsedStr}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: derive per-item status from juice_tracking
// ─────────────────────────────────────────────────────────────────────────────

const getItemStatus = (order, itemId) => {
    const jt = order.juice_tracking || {};
    const n = Number(itemId);
    const served   = (jt.served_item_ids   || []).map(Number);
    const ready    = (jt.ready_item_ids    || []).map(Number);
    const preparing = (jt.preparing_item_ids || []).map(Number);

    if (served.includes(n))    return 'SERVED';
    if (ready.includes(n))     return 'READY';
    if (preparing.includes(n)) return 'PREPARING';
    return 'PLACED';
};

// ─────────────────────────────────────────────────────────────────────────────
// OrderDetailView — drill-down view for a single order
// ─────────────────────────────────────────────────────────────────────────────

const OrderDetailView = ({
    orderId, orders, activeSessions, selectedStaffId, setSelectedStaffId,
    handleStatusUpdate, setSelectedItemId, onBack
}) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--bev-text-muted)', marginBottom: '1.5rem' }}>
                    Order not found or completed.
                </p>
                <button className="bev-back-btn" onClick={onBack}>← Back to Queue</button>
            </div>
        );
    }

    const isTakeaway = !order.table_id || order.table_id === 0;

    return (
        <div className="bev-order-detail-workspace">
            <div className="bev-detail-header-row">
                <button className="bev-back-btn" onClick={onBack}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Queue
                </button>
                <div className="bev-order-detail-title">
                    <h2>Order #{order.order_id} — Beverages</h2>
                </div>
            </div>

            <div className="bev-order-detail-layout">
                {/* Left Panel: Order Info */}
                <div className="bev-detail-info-panel">
                    <div className="bev-info-section">
                        <h3>Order Data</h3>
                        <div className="bev-info-grid">
                            <div className="bev-info-row">
                                <span className="bev-info-label">Service Type:</span>
                                <span className="bev-info-value">
                                    {isTakeaway ? 'TAKEAWAY' : `TABLE ${order.table_id}`}
                                </span>
                            </div>
                            <div className="bev-info-row">
                                <span className="bev-info-label">Placed At:</span>
                                <span className="bev-info-value">
                                    {new Date(normalizeDate(order.created_at)).toLocaleTimeString(
                                        [], { hour: '2-digit', minute: '2-digit' }
                                    )}
                                </span>
                            </div>
                            <div className="bev-info-row">
                                <span className="bev-info-label">Waiting Time:</span>
                                <span className="bev-info-value">
                                    <LiveTimer
                                        placedAtStr={order.created_at}
                                        servedAtStr={order.juice_tracking?.served_at}
                                        className="bev-timer-val"
                                    />
                                </span>
                            </div>
                            <div className="bev-info-row">
                                <span className="bev-info-label">Customer:</span>
                                <span className="bev-info-value">
                                    {order.customer_phone || 'None provided'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="bev-info-section">
                            <h3>Special Notes</h3>
                            <div style={{
                                background: '#0a1b18', borderRadius: '10px',
                                padding: '1rem', color: '#2dd4bf',
                                fontSize: '0.88rem', fontStyle: 'italic',
                                borderLeft: '3px solid #0d9488'
                            }}>
                                {order.notes}
                            </div>
                        </div>
                    )}

                    <div className="bev-info-section">
                        <h3>Preparing Staff</h3>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--bev-text-muted)' }}>
                            Select the staff member preparing these beverages.
                        </p>
                        <select
                            value={selectedStaffId}
                            onChange={e => setSelectedStaffId(e.target.value)}
                            className="bev-staff-select-dropdown"
                        >
                            {activeSessions.map(s => (
                                <option key={s.staff_id} value={s.staff_id}>
                                    {s.staff_name} ({s.staff_id})
                                </option>
                            ))}
                            {activeSessions.length === 0 &&
                                <option value="">NO ACTIVE STAFF</option>
                            }
                        </select>
                    </div>
                </div>

                {/* Right Panel: Items List */}
                <div className="bev-detail-items-panel">
                    <h3>Beverage Items ({order.items.length})</h3>
                    <div className="bev-detail-items-list">
                        {order.items.map(item => {
                            const itemStatus = getItemStatus(order, item.order_item_id);

                            return (
                                <div
                                    key={item.order_item_id}
                                    className={`bev-detail-item-row ${itemStatus.toLowerCase()}`}
                                    onClick={() => setSelectedItemId(item.order_item_id)}
                                >
                                    <div className="bev-item-main-details">
                                        <div className="bev-item-name-row">
                                            <h4>{item.item_name}</h4>
                                            <span className="bev-qty-tag-detail">x{item.quantity}</span>
                                        </div>
                                        {item.selected_variants?.length > 0 && (
                                            <div className="bev-item-variants">
                                                {item.selected_variants.map((v, i) => (
                                                    <span key={i} className="bev-variant-pill">
                                                        {v.variant_name}: {v.option_name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.note && (
                                            <p style={{
                                                margin: '4px 0 0', fontSize: '0.78rem',
                                                color: '#2dd4bf', fontStyle: 'italic'
                                            }}>
                                                Note: "{item.note}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="bev-item-action-controls">
                                        <span className={`bev-status-pill-big ${itemStatus.toLowerCase()}`}>
                                            {itemStatus}
                                        </span>
                                        {itemStatus === 'PLACED' && (
                                            <button
                                                className="bev-action-btn bev-start-btn"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleStatusUpdate(
                                                        order.order_id, 'PREPARING', item.order_item_id
                                                    );
                                                }}
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {itemStatus === 'PREPARING' && (
                                            <button
                                                className="bev-action-btn bev-ready-btn"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    const next = isTakeaway ? 'SERVED' : 'READY';
                                                    handleStatusUpdate(
                                                        order.order_id, next, item.order_item_id
                                                    );
                                                }}
                                            >
                                                {isTakeaway ? 'Mark Served' : 'Mark Ready'}
                                            </button>
                                        )}
                                        {itemStatus === 'READY' && (
                                            <span className="bev-action-text-info"
                                                onClick={e => e.stopPropagation()}>
                                                Waiting for Waiter
                                            </span>
                                        )}
                                        {itemStatus === 'SERVED' && (
                                            <span className="bev-action-text-success"
                                                onClick={e => e.stopPropagation()}>
                                                {isTakeaway ? '✓ Completed' : '✓ Served'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// BeverageDashboard — Main Component
// Architecture: mirrors ChefDashboard.jsx exactly.
// Auth: ?pin= token passed as query param (same KDS pattern).
// Tracking: reads/writes orders.juice_tracking ONLY.
// Session: uses /api/juice/session (active_beverage_sessions).
// ─────────────────────────────────────────────────────────────────────────────

const BeverageDashboard = () => {
    const [pin, setPin] = useState(sessionStorage.getItem('bev_pin') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('bev_pin'));

    const [orders, setOrders] = useState([]);
    const [backendCompletedOrders, setBackendCompletedOrders] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);
    const [configMissing, setConfigMissing] = useState(false);

    const [currentView, setCurrentView] = useState('DASHBOARD');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [historySearch, setHistorySearch] = useState('');
    const [historySort, setHistorySort] = useState('latest');

    const [pinInput, setPinInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [selectedStaffId, setSelectedStaffId] = useState('');

    // Live clock in top bar
    const [clockStr, setClockStr] = useState(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    const API_BASE = `${BASE}/juice`;

    // ── Clock tick ────────────────────────────────────────────────────────────
    useEffect(() => {
        const iv = setInterval(() => {
            setClockStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 30000);
        return () => clearInterval(iv);
    }, []);

    // ── Polling ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) return;

        const init = async () => {
            const savedUserStr = sessionStorage.getItem('bev_user');
            if (savedUserStr) {
                try {
                    const u = JSON.parse(savedUserStr);
                    await axios.post(`${API_BASE}/session/start`, {
                        staff_name: u.username,
                        staff_id: u.username,
                        pin
                    });
                } catch {
                    // Session already started or server error — ignore
                }
            }
            fetchOrders();
            fetchCompleted();
            fetchSessions();
        };

        init();

        const socket = getSocket(pin);
        if (socket) {
            const handleOrderCreated = () => fetchOrders();
            const handleItemStatusChanged = () => { fetchOrders(); fetchCompleted(); };
            const handleOrderStatusChanged = () => { fetchOrders(); fetchCompleted(); };
            const handleSessionUpdated = () => fetchSessions();
            const handleConnect = () => { fetchOrders(); fetchCompleted(); fetchSessions(); };

            socket.on('order:created', handleOrderCreated);
            socket.on('order:item_status_changed', handleItemStatusChanged);
            socket.on('order:status_changed', handleOrderStatusChanged);
            socket.on('session:updated', handleSessionUpdated);
            socket.on('connect', handleConnect);

            const iv = setInterval(() => {
                fetchOrders();
                fetchCompleted();
                fetchSessions();
            }, 8000);

            return () => {
                clearInterval(iv);
                socket.off('order:created', handleOrderCreated);
                socket.off('order:item_status_changed', handleItemStatusChanged);
                socket.off('order:status_changed', handleOrderStatusChanged);
                socket.off('session:updated', handleSessionUpdated);
                socket.off('connect', handleConnect);
            };
        }

        const iv = setInterval(() => {
            fetchOrders();
            fetchCompleted();
            fetchSessions();
        }, 8000);
        return () => clearInterval(iv);
    }, [isAuthenticated, pin]);

    // ── Data Fetchers ─────────────────────────────────────────────────────────

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE}/orders`, { params: { pin } });
            if (res.data?.config_missing) {
                setConfigMissing(true);
                setOrders([]);
            } else {
                setConfigMissing(false);
                setOrders(res.data || []);
            }
        } catch (err) { handleApiError(err); }
    };

    const fetchCompleted = async () => {
        try {
            const res = await axios.get(`${API_BASE}/completed`, { params: { pin } });
            setBackendCompletedOrders(res.data || []);
        } catch (err) { handleApiError(err); }
    };

    const fetchSessions = async () => {
        try {
            const res = await axios.get(`${API_BASE}/session`);
            const sessions = res.data || [];
            setActiveSessions(sessions);
            if (sessions.length > 0 && !selectedStaffId) {
                setSelectedStaffId(sessions[0].staff_id);
            }
        } catch { /* non-critical */ }
    };

    const handleApiError = (err) => {
        if (err.response?.status === 401) {
            setIsAuthenticated(false);
            sessionStorage.removeItem('bev_pin');
            sessionStorage.removeItem('bev_user');
        }
    };

    // ── Completed Orders (derived) ────────────────────────────────────────────

    const completedOrders = React.useMemo(() => {
        const map = new Map();

        const addItem = (order, item) => {
            const existing = map.get(order.order_id) || {
                ...order,
                items: [],
                completedAt: order.juice_tracking?.served_at || order.updated_at
            };
            if (!existing.items.some(i => i.order_item_id === item.order_item_id)) {
                existing.items.push(item);
            }
            const itemServedAt = order.juice_tracking?.item_served_times?.[item.order_item_id]
                || order.juice_tracking?.served_at
                || order.updated_at;
            if (new Date(normalizeDate(itemServedAt)) > new Date(normalizeDate(existing.completedAt))) {
                existing.completedAt = itemServedAt;
            }
            map.set(order.order_id, existing);
        };

        backendCompletedOrders.forEach(order => {
            const servedIds = (order.juice_tracking?.served_item_ids || []).map(Number);
            order.items.forEach(item => {
                if (servedIds.includes(Number(item.order_item_id)) ||
                    ['SERVED', 'CLOSED', 'PAID'].includes(order.status)) {
                    addItem(order, item);
                }
            });
        });

        orders.forEach(order => {
            if (order.status !== 'SERVED') {
                const servedIds = (order.juice_tracking?.served_item_ids || []).map(Number);
                order.items.forEach(item => {
                    if (servedIds.includes(Number(item.order_item_id))) addItem(order, item);
                });
            }
        });

        let list = Array.from(map.values());
        if (historySearch) {
            const s = historySearch.toLowerCase();
            list = list.filter(o =>
                o.order_id.toString().includes(s) ||
                (o.table_id && o.table_id.toString().includes(s)) ||
                o.items.some(i => i.item_name.toLowerCase().includes(s))
            );
        }
        return list.sort((a, b) => {
            const tA = new Date(normalizeDate(a.completedAt));
            const tB = new Date(normalizeDate(b.completedAt));
            return historySort === 'latest' ? tB - tA : tA - tB;
        });
    }, [backendCompletedOrders, orders, historySearch, historySort]);

    // ── Auth ──────────────────────────────────────────────────────────────────

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${BASE}/auth/login`, {
                username: pinInput,
                password: passwordInput
            });
            const user = res.data.user;
            if (user.role === 'BEVERAGE_STAFF' || user.role === 'ADMIN') {
                sessionStorage.setItem('bev_pin', res.data.token);
                sessionStorage.setItem('bev_user', JSON.stringify(user));
                setPin(res.data.token);
                setIsAuthenticated(true);
            } else {
                setError('Access denied. Beverage staff account required.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    const handleLogout = async () => {
        try {
            const savedStr = sessionStorage.getItem('bev_user');
            if (savedStr) {
                const u = JSON.parse(savedStr);
                await axios.post(`${API_BASE}/session/end`, {
                    staff_id: u.username,
                    pin
                });
            }
        } catch { /* best-effort */ }
        setIsAuthenticated(false);
        sessionStorage.removeItem('bev_pin');
        sessionStorage.removeItem('bev_user');
    };

    // ── Status Updates ────────────────────────────────────────────────────────

    const handleStatusUpdate = async (orderId, newStatus, itemId = null) => {
        if (newStatus === 'PREPARING' && !selectedStaffId) {
            alert('Please select a staff member first.');
            return;
        }
        try {
            const staff = activeSessions.find(s => s.staff_id === selectedStaffId);
            await axios.patch(`${API_BASE}/orders/${orderId}/status`, {
                status: newStatus,
                itemId,
                staffId: selectedStaffId,
                staffName: staff?.staff_name,
                pin
            });
            fetchOrders();
        } catch {
            alert('Status update failed. Please try again.');
        }
    };

    // ── End staff session ─────────────────────────────────────────────────────

    const endSession = async (staffId) => {
        try {
            await axios.post(`${API_BASE}/session/end`, { staff_id: staffId, pin });
            fetchSessions();
            alert('Session ended.');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to end session');
        }
    };

    // ── Filtered Orders (Dashboard) ───────────────────────────────────────────

    const filteredOrders = React.useMemo(() => {
        return orders.filter(o => {
            const isTakeaway = !o.table_id || o.table_id === 0;
            const matchType = filterType === 'ALL'
                || (filterType === 'TAKEAWAY' && isTakeaway)
                || (filterType === 'DINEIN' && !isTakeaway);
            const matchSearch =
                o.order_id.toString().includes(searchTerm) ||
                `T${o.table_id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.items.some(i => i.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchType && matchSearch;
        });
    }, [orders, filterType, searchTerm]);

    // ── Navigate helpers ──────────────────────────────────────────────────────

    const goToDashboard = () => {
        setCurrentView('DASHBOARD');
        setSelectedOrderId(null);
        setSelectedItemId(null);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Login Screen
    // ─────────────────────────────────────────────────────────────────────────

    if (!isAuthenticated) {
        return (
            <PortalLoginCard
                title="Beverage Portal"
                subtitle="Chill Grand — Beverage Station"
                accentColor="#0d9488"
                footerLabel="beverage-portal-7731"
                usernameValue={pinInput}
                passwordValue={passwordInput}
                onUsernameChange={e => setPinInput(e.target.value)}
                onPasswordChange={e => setPasswordInput(e.target.value)}
                onSubmit={handleLogin}
                error={error}
                loading={false}
                submitLabel="Sign In to Beverage Portal"
            />
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Main Dashboard
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="bev-layout">
            {/* ── Sidebar ── */}
            <aside className="bev-sidebar">
                <div className="bev-sidebar-brand">
                    <img src={logo} alt="Chill Grand" />
                    <h3>CHILL GRAND</h3>
                </div>
                <div className="bev-station-badge"> Beverage Station</div>

                <nav className="bev-sidebar-nav">
                    <button
                        className={currentView === 'DASHBOARD' ? 'active' : ''}
                        onClick={goToDashboard}
                    >
                        Live Queue
                    </button>
                    <button
                        className={currentView === 'COMPLETED' ? 'active' : ''}
                        onClick={() => { setCurrentView('COMPLETED'); setSelectedOrderId(null); setSelectedItemId(null); }}
                    >
                        Completed
                    </button>
                    <button
                        className={currentView === 'SESSION' ? 'active' : ''}
                        onClick={() => { setCurrentView('SESSION'); setSelectedOrderId(null); setSelectedItemId(null); }}
                    >
                        My Session
                    </button>
                </nav>

                <div className="bev-sidebar-footer">
                    <div className="bev-active-count-bubble">
                        {activeSessions.length} Staff Online
                    </div>
                    <button className="bev-logout-btn" onClick={handleLogout}>
                        Logout Portal
                    </button>
                </div>
            </aside>

            {/* ── Main Area ── */}
            <main className="bev-main">
                {/* Top Bar */}
                <header className="bev-top-bar">
                    <div className="bev-view-title">
                        <h2>
                            {currentView === 'DASHBOARD'
                                ? 'Live Beverage Queue'
                                : currentView === 'COMPLETED'
                                    ? 'Completed Orders'
                                    : 'Beverage Sessions'}
                        </h2>
                    </div>

                    {currentView === 'DASHBOARD' && (
                        <div className="bev-header-controls">
                            <div className="bev-search-wrapper">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search item / table..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="ALL">All Services</option>
                                <option value="DINEIN">Dine-In</option>
                                <option value="TAKEAWAY">Take-Away</option>
                            </select>
                        </div>
                    )}

                    {currentView === 'COMPLETED' && (
                        <div className="bev-header-controls">
                            <div className="bev-search-wrapper">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search completed..."
                                    value={historySearch}
                                    onChange={e => setHistorySearch(e.target.value)}
                                />
                            </div>
                            <div className="bev-sort-pills">
                                <button
                                    className={`bev-pill-btn ${historySort === 'latest' ? 'active' : ''}`}
                                    onClick={() => setHistorySort('latest')}
                                >
                                    <ArrowDownWideNarrow size={14} /> Latest
                                </button>
                                <button
                                    className={`bev-pill-btn ${historySort === 'oldest' ? 'active' : ''}`}
                                    onClick={() => setHistorySort('oldest')}
                                >
                                    <ArrowUpNarrowWide size={14} /> Oldest
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bev-live-clock">{clockStr}</div>
                </header>

                {/* Content */}
                <div className="bev-content">

                    {/* ── DASHBOARD VIEW ─────────────────────────────────── */}
                    {currentView === 'DASHBOARD' && (
                        selectedOrderId ? (
                            <OrderDetailView
                                orderId={selectedOrderId}
                                orders={orders}
                                activeSessions={activeSessions}
                                selectedStaffId={selectedStaffId}
                                setSelectedStaffId={setSelectedStaffId}
                                handleStatusUpdate={handleStatusUpdate}
                                setSelectedItemId={setSelectedItemId}
                                onBack={() => setSelectedOrderId(null)}
                            />
                        ) : (
                            <div className="bev-grid">
                                {configMissing && (
                                    <div className="bev-config-banner">
                                        <h3>⚙️ Station Not Configured</h3>
                                        <p>
                                            No beverage categories are assigned to this station.
                                            Ask your Admin to configure the station mapping in the
                                            app settings.
                                        </p>
                                    </div>
                                )}

                                {!configMissing && filteredOrders.length > 0
                                    ? filteredOrders.map(order => {
                                        const isTakeaway = !order.table_id || order.table_id === 0;
                                        const jt = order.juice_tracking || {};
                                        const isAnyPreparing = order.items.some(item =>
                                            (jt.preparing_item_ids || []).map(Number)
                                                .includes(Number(item.order_item_id))
                                        );
                                        const isAnyReady = order.items.some(item =>
                                            (jt.ready_item_ids || []).map(Number)
                                                .includes(Number(item.order_item_id))
                                        );
                                        let overallStatus = 'PLACED';
                                        if (isAnyPreparing) overallStatus = 'PREPARING';
                                        else if (isAnyReady) overallStatus = 'READY';

                                        return (
                                            <div
                                                key={order.order_id}
                                                className="bev-order-card"
                                                onClick={() => setSelectedOrderId(order.order_id)}
                                            >
                                                <div className="bev-card-top">
                                                    <span className="bev-order-num">
                                                        #{order.order_id}
                                                    </span>
                                                    <span className="bev-table-badge">
                                                        {isTakeaway ? 'TAKEAWAY' : `TABLE ${order.table_id}`}
                                                    </span>
                                                </div>

                                                <div className="bev-items-list">
                                                    {order.items.map(item => {
                                                        const s = getItemStatus(order, item.order_item_id);
                                                        return (
                                                            <div
                                                                key={item.order_item_id}
                                                                className={`bev-item-row ${s.toLowerCase()}`}
                                                            >
                                                                <span className="bev-item-name-qty">
                                                                    {item.item_name}
                                                                    <strong className="bev-qty-tag">
                                                                        {' '}x{item.quantity}
                                                                    </strong>
                                                                </span>
                                                                <span className={`bev-item-status-pill ${s.toLowerCase()}`}>
                                                                    {s}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="bev-timer-section"
                                                    style={{ marginTop: 'auto', marginBottom: '0.5rem' }}>
                                                    <div className="bev-timer-row">
                                                        <span className="bev-timer-label">
                                                            Time Elapsed:
                                                        </span>
                                                        <LiveTimer
                                                            placedAtStr={order.created_at}
                                                            servedAtStr={jt.served_at}
                                                            className="bev-timer-val"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bev-card-bottom">
                                                    <span className={`bev-status-badge bev-${overallStatus.toLowerCase()}-badge`}>
                                                        {overallStatus}
                                                    </span>
                                                    {jt.prepared_by_staff_id && (
                                                        <div className="bev-staff-initials">
                                                            {jt.prepared_by_staff_id
                                                                .slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                    : !configMissing && (
                                        <div className="bev-empty-state">
                                            <span className="bev-empty-icon">🧃</span>
                                            <span>No pending beverage orders. Station is clear!</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    )}

                    {/* ── COMPLETED VIEW ─────────────────────────────────── */}
                    {currentView === 'COMPLETED' && (
                        <div className="bev-grid">
                            {completedOrders.length > 0
                                ? completedOrders.map(order => {
                                    const createdAt = new Date(normalizeDate(order.created_at));
                                    const completedAt = new Date(normalizeDate(order.completedAt));
                                    const jt = order.juice_tracking || {};
                                    const acceptedAt = jt.accepted_at
                                        ? new Date(normalizeDate(jt.accepted_at))
                                        : null;
                                    const totalMs = completedAt - createdAt;
                                    const prepMs = acceptedAt ? (completedAt - acceptedAt) : 0;
                                    const isTakeaway = !order.table_id || order.table_id === 0;

                                    return (
                                        <div
                                            key={order.order_id}
                                            className="bev-order-card history-card"
                                            onClick={() => {
                                                setSelectedOrderId(order.order_id);
                                                setCurrentView('DASHBOARD');
                                            }}
                                        >
                                            <div className="bev-card-top">
                                                <span className="bev-order-num">#{order.order_id}</span>
                                                <span className="bev-table-badge">
                                                    {isTakeaway ? 'TAKEAWAY' : `TABLE ${order.table_id}`}
                                                </span>
                                            </div>

                                            <div className="bev-items-list">
                                                {order.items.map(item => (
                                                    <div
                                                        key={item.order_item_id}
                                                        className="bev-item-row served"
                                                    >
                                                        <span className="bev-item-name-qty">
                                                            {item.item_name}
                                                            <strong className="bev-qty-tag">
                                                                {' '}x{item.quantity}
                                                            </strong>
                                                        </span>
                                                        <span className="bev-item-status-pill served">
                                                            SERVED
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bev-timer-section"
                                                style={{ marginTop: 'auto', marginBottom: '0.5rem' }}>
                                                <div className="bev-timer-row">
                                                    <span className="bev-timer-label">Prep Time:</span>
                                                    <span className="bev-timer-val bev-timer-fixed">
                                                        {prepMs <= 0 ? '0m 0s' : formatDuration(prepMs)}
                                                    </span>
                                                </div>
                                                <div className="bev-timer-row">
                                                    <span className="bev-timer-label">Total Time:</span>
                                                    <span className="bev-timer-val bev-timer-fixed">
                                                        {totalMs <= 0 ? '0m 0s' : formatDuration(totalMs)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bev-card-bottom">
                                                <div className="bev-history-served-row">
                                                    <span className="bev-status-badge bev-served-badge">
                                                        SERVED
                                                    </span>
                                                    <span className="bev-served-timestamp">
                                                        {completedAt.toLocaleTimeString([], {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                                : (
                                    <div className="bev-empty-state">
                                        <span className="bev-empty-icon">📋</span>
                                        <span>No completed beverage orders yet.</span>
                                    </div>
                                )
                            }
                        </div>
                    )}

                    {/* ── SESSION VIEW ───────────────────────────────────── */}
                    {currentView === 'SESSION' && (
                        <div className="bev-session-portal">
                            <div className="bev-active-staff-section">
                                <div className="bev-section-header">
                                    <h4 className="bev-section-title">
                                        Active Beverage Staff
                                    </h4>
                                    <div className="bev-count-tag">
                                        {activeSessions.length} Staff Online
                                    </div>
                                </div>

                                <div className="bev-staff-grid">
                                    {activeSessions.length > 0
                                        ? activeSessions.map(s => {
                                            const initials = s.staff_name
                                                ? s.staff_name.split(' ')
                                                    .map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                                : '??';
                                            const startTime = s.start_time
                                                ? new Date(s.start_time).toLocaleTimeString(
                                                    [], { hour: '2-digit', minute: '2-digit' }
                                                )
                                                : '--:--';

                                            return (
                                                <div key={s.staff_id} className="bev-staff-card">
                                                    <div className="bev-staff-card-inner">
                                                        <div className="bev-staff-avatar">
                                                            <span>{initials}</span>
                                                            <div className="bev-status-indicator" />
                                                        </div>
                                                        <div className="bev-staff-details">
                                                            <div className="bev-staff-name-row">
                                                                <h4>{s.staff_name}</h4>
                                                                <span className="bev-status-label">
                                                                    ACTIVE
                                                                </span>
                                                            </div>
                                                            <p className="bev-staff-id-tag">
                                                                Personnel ID: {s.staff_id}
                                                            </p>
                                                            <span className="bev-shift-time">
                                                                Started at {startTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="bev-end-session-btn"
                                                        onClick={() => endSession(s.staff_id)}
                                                    >
                                                        <svg width="18" height="18" fill="none"
                                                            stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round"
                                                                strokeLinejoin="round" strokeWidth={2}
                                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        End Session
                                                    </button>
                                                </div>
                                            );
                                        })
                                        : (
                                            <div className="bev-empty-staff-state">
                                                <p>No active beverage staff currently on duty.</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default BeverageDashboard;
