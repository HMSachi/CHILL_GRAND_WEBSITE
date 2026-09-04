import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide, Clock } from 'lucide-react';
import '../styles/pages/ChefDashboard.css';
import PortalLoginCard from '../components/portals/PortalLoginCard';
import logo from '../assets/logo.png';
import { API_BASE_URL as BASE } from '../config/api';
import { getSocket } from '../services/socket';

const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    const str = String(dateStr);
    return (str.includes('T') && !str.endsWith('Z') && !str.includes('+'))
        ? `${str}Z`
        : str;
};

const formatDuration = (ms) => {
    if (ms === null || ms === undefined || isNaN(ms)) return "";
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
};

const LiveTimer = ({ placedAtStr, servedAtStr, className = "" }) => {
    const [elapsedStr, setElapsedStr] = useState("");
    const [timerClass, setTimerClass] = useState("timer-ok");

    useEffect(() => {
        if (!placedAtStr) {
            setElapsedStr("");
            return;
        }

        const calculateTime = () => {
            const placedTime = new Date(normalizeDate(placedAtStr));
            const endTime = servedAtStr ? new Date(normalizeDate(servedAtStr)) : new Date();
            const diffMs = endTime - placedTime;
            const diffSecTotal = Math.max(0, Math.floor(diffMs / 1000));
            const mins = Math.floor(diffSecTotal / 60);
            const secs = diffSecTotal % 60;
            
            let tClass = "timer-ok";
            if (mins >= 5) tClass = "timer-warning";
            if (mins >= 10) tClass = "timer-late";
            setTimerClass(tClass);

            return `${mins}m ${secs}s`;
        };

        // Initial calculation
        setElapsedStr(calculateTime());

        // If served, we don't need a ticking interval
        if (servedAtStr) {
            return;
        }

        const interval = setInterval(() => {
            setElapsedStr(calculateTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [placedAtStr, servedAtStr]);

    return <span className={`${className} ${timerClass}`}>{elapsedStr}</span>;
};

const ItemDetailView = ({ orderId, itemId, orders, activeSessions, selectedChefId, setSelectedChefId, handleStatusUpdate, onBack }) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return (
            <div className="order-detail-error" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Order not found or has been completed.</p>
                <button className="back-btn-kds" onClick={onBack}>← Back to Order</button>
            </div>
        );
    }
    
    const item = order.items.find(i => i.order_item_id === itemId);
    if (!item) {
        return (
            <div className="order-detail-error" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Item not found in this order.</p>
                <button className="back-btn-kds" onClick={onBack}>← Back to Order</button>
            </div>
        );
    }

    const itemStatusId = Number(item.order_item_id);
    const servedIds = (order.kitchen_tracking?.served_item_ids || []).map(Number);
    const readyIds = (order.kitchen_tracking?.ready_item_ids || []).map(Number);
    const preparingIds = (order.kitchen_tracking?.preparing_item_ids || []).map(Number);

    let itemStatus = 'PLACED';
    if (servedIds.includes(itemStatusId)) itemStatus = 'SERVED';
    else if (readyIds.includes(itemStatusId)) itemStatus = 'READY';
    else if (preparingIds.includes(itemStatusId)) itemStatus = 'PREPARING';

    const placedAt = new Date(normalizeDate(order.created_at));
    const kt = order.kitchen_tracking || {};
    const acceptedAt = kt.accepted_at ? new Date(normalizeDate(kt.accepted_at)) : null;
    const readyAtTime = kt.item_ready_times?.[item.order_item_id] || kt.ready_at;
    const readyAt = readyAtTime ? new Date(normalizeDate(readyAtTime)) : null;
    const servedAtTime = kt.item_served_times?.[item.order_item_id] || kt.served_at || order.updated_at;
    const servedAt = servedIds.includes(itemStatusId) || ['SERVED', 'CLOSED', 'PAID'].includes(order.status)
        ? new Date(normalizeDate(servedAtTime)) : null;

    const activePrepTimeMs = (acceptedAt && readyAt) ? (readyAt - acceptedAt) : null;
    const pickupDelayMs = (readyAt && servedAt) ? (servedAt - readyAt) : null;
    const totalCycleMs = servedAt ? (servedAt - placedAt) : null;

    // Find the portion or size from selected_variants
    const portionObj = item.selected_variants?.find(v => 
        v.variant_name.toLowerCase().includes('portion') || 
        v.variant_name.toLowerCase().includes('size') ||
        v.variant_name.toLowerCase().includes('type')
    );
    
    // If not found, check if there is any variant at all
    const portionText = portionObj 
        ? portionObj.option_name 
        : (item.selected_variants?.length > 0 
            ? item.selected_variants[0].option_name 
            : 'Regular'); // default to Regular if no variant exists

    // Other options/variants (not portion)
    const otherVariants = item.selected_variants?.filter(v => v !== portionObj) || [];

    return (
        <div className="item-detail-workspace">
            <div className="detail-header-row">
                <button className="back-btn-kds" onClick={onBack}>
                    <svg style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '5px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Order #{order.order_id}
                </button>
                <div className="order-detail-title">
                    <h2>{item.item_name} Detail</h2>
                </div>
            </div>

            <div className="item-detail-layout">
                {/* Left Column: Visual Preview */}
                <div className="item-detail-visual-panel">
                    <img src={item.menu_item?.image || 'https://via.placeholder.com/400x300?text=Food'} alt={item.item_name} className="item-detail-img" />
                    <div className="item-detail-img-overlay"></div>
                </div>

                {/* Right Column: Menu details & extra notes */}
                <div className="item-detail-info-panel">
                    <div className="item-info-header" style={{ paddingBottom: '1rem', borderBottom: 'none' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-muted)' }}>Meal Status</span>
                        <span className={`status-pill-big ${itemStatus.toLowerCase()}`}>{itemStatus}</span>
                    </div>

                    <div className="info-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                        <h3>Meal Details</h3>
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="info-label">Meal Name:</span>
                                <span className="info-value" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>{item.item_name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Quantity:</span>
                                <span className="info-value" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>x{item.quantity}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Portion:</span>
                                <span className="info-value" style={{ color: '#34d399', fontWeight: 'bold' }}>{portionText}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Waiting Time:</span>
                                <span className="info-value">
                                    <LiveTimer placedAtStr={order.created_at} servedAtStr={servedAt} className="timer-val" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {otherVariants.length > 0 && (
                        <div className="info-section">
                            <h3>Selected Options</h3>
                            <div className="detail-variants-list">
                                {otherVariants.map((v, i) => (
                                    <div key={i} className="detail-variant-item">
                                        <span className="variant-label">{v.variant_name}:</span>
                                        <span className="variant-value">{v.option_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {item.note && (
                        <div className="info-section">
                            <h3>Special Notes</h3>
                            <div className="item-notes-box">
                                "{item.note}"
                            </div>
                        </div>
                    )}

                    <div className="info-section">
                        <h3>Cooking Milestones</h3>
                        <div className="milestones-list">
                            <div className="milestone-row">
                                <span className="milestone-label">Placed At:</span>
                                <span className="milestone-value">{placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {acceptedAt && (
                                <div className="milestone-row">
                                    <span className="milestone-label">Started cooking:</span>
                                    <span className="milestone-value">{acceptedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            )}
                            {readyAt && (
                                <div className="milestone-row">
                                    <span className="milestone-label">Marked ready:</span>
                                    <span className="milestone-value" style={{ color: '#f59e0b' }}>{readyAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            )}
                            {servedAt && (
                                <div className="milestone-row">
                                    <span className="milestone-label">Served at table:</span>
                                    <span className="milestone-value" style={{ color: '#34d399' }}>{servedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            )}

                            {activePrepTimeMs !== null && (
                                <div className="milestone-row highlight" style={{ marginTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem' }}>
                                    <span className="milestone-label">Active cooking:</span>
                                    <span className="milestone-value" style={{ color: '#10b981' }}>{formatDuration(activePrepTimeMs)}</span>
                                </div>
                            )}
                            {pickupDelayMs !== null && (
                                <div className="milestone-row highlight">
                                    <span className="milestone-label">Pickup delay:</span>
                                    <span className="milestone-value" style={{ color: '#f59e0b' }}>{formatDuration(pickupDelayMs)}</span>
                                </div>
                            )}
                            {totalCycleMs !== null && (
                                <div className="milestone-row highlight">
                                    <span className="milestone-label">Total Prep duration:</span>
                                    <span className="milestone-value" style={{ color: '#10b981', fontWeight: 700 }}>{formatDuration(totalCycleMs)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Customer Contact</h3>
                        <p className="item-detail-phone">{order.customer_phone || 'No phone number provided'}</p>
                    </div>

                    <div className="info-section">
                        <h3>Preparing Chef</h3>
                        <select 
                            value={selectedChefId} 
                            onChange={e => setSelectedChefId(e.target.value)} 
                            className="chef-select-dropdown"
                            style={{ marginTop: '0.5rem' }}
                        >
                            {activeSessions.map(s => <option key={s.chef_id} value={s.chef_id}>{s.chef_name} ({s.chef_id})</option>)}
                            {activeSessions.length === 0 && <option value="">NO ACTIVE STAFF</option>}
                        </select>
                    </div>

                    <div className="item-detail-action-footer">
                        {itemStatus === 'PLACED' && (
                            <button 
                                className="item-detail-btn start-prep-btn"
                                onClick={() => handleStatusUpdate(order.order_id, 'PREPARING', item.order_item_id)}
                            >
                                Start Preparing Item
                            </button>
                        )}
                        {itemStatus === 'PREPARING' && (
                            <button 
                                className="item-detail-btn mark-ready-btn"
                                onClick={() => {
                                    const nextStatus = (!order.table_id || order.table_id === 0) ? 'SERVED' : 'READY';
                                    handleStatusUpdate(order.order_id, nextStatus, item.order_item_id);
                                }}
                            >
                                {(!order.table_id || order.table_id === 0) ? 'Mark Item as Completed' : 'Mark Item as Ready'}
                            </button>
                        )}
                        {itemStatus === 'READY' && (
                            <div className="status-note waiting-waiter-note">
                                Waiting for Waiter to Serve
                            </div>
                        )}
                        {itemStatus === 'SERVED' && (
                            <div className="status-note served-note">
                                {(!order.table_id || order.table_id === 0) ? '✓ Item Completed' : '✓ Item Delivered & Served'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderDetailView = ({ orderId, orders, activeSessions, selectedChefId, setSelectedChefId, handleStatusUpdate, setSelectedItemId, onBack }) => {
    const order = orders.find(o => o.order_id === orderId);

    if (!order) {
        return (
            <div className="order-detail-error" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Order not found or has been completed.</p>
                <button className="back-btn-kds" onClick={onBack}>← Back to Queue</button>
            </div>
        );
    }

    const isTakeaway = !order.table_id || order.table_id === 0;

    return (
        <div className="order-detail-workspace">
            <div className="detail-header-row">
                <button className="back-btn-kds" onClick={onBack}>
                    <svg style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '5px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Queue
                </button>
                <div className="order-detail-title">
                    <h2>Order #{order.order_id} Details</h2>
                </div>
            </div>

            <div className="order-detail-layout">
                {/* Left Panel: Info & Metrics */}
                <div className="detail-info-panel">
                    <div className="info-section">
                        <h3>Order Data</h3>
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="info-label">Service Type:</span>
                                <span className="info-value" style={{ color: '#fff', fontWeight: 'bold' }}>{isTakeaway ? 'TAKEAWAY' : `TABLE ${order.table_id}`}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Placed At:</span>
                                <span className="info-value">{new Date(normalizeDate(order.created_at)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Waiting Time:</span>
                                <span className="info-value">
                                    <LiveTimer placedAtStr={order.created_at} servedAtStr={order.kitchen_tracking?.served_at} className="timer-val" />
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Customer Contact:</span>
                                <span className="info-value">{order.customer_phone || 'None provided'}</span>
                            </div>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="info-section">
                            <h3>Special Notes</h3>
                            <div className="notes-box">
                                {order.notes}
                            </div>
                        </div>
                    )}

                    <div className="info-section">
                        <h3>Preparing Chef</h3>
                        <p className="chef-assign-help">Select the chef actively managing or preparing these items.</p>
                        <select 
                            value={selectedChefId} 
                            onChange={e => setSelectedChefId(e.target.value)} 
                            className="chef-select-dropdown"
                        >
                            {activeSessions.map(s => <option key={s.chef_id} value={s.chef_id}>{s.chef_name} ({s.chef_id})</option>)}
                            {activeSessions.length === 0 && <option value="">NO ACTIVE STAFF</option>}
                        </select>
                    </div>
                </div>

                {/* Right Panel: Items List & Actions */}
                <div className="detail-items-panel">
                    <h3>Order Items ({order.items.length})</h3>
                    <div className="detail-items-list">
                        {order.items.map(item => {
                            const itemId = Number(item.order_item_id);
                            const servedIds = (order.kitchen_tracking?.served_item_ids || []).map(Number);
                            const readyIds = (order.kitchen_tracking?.ready_item_ids || []).map(Number);
                            const preparingIds = (order.kitchen_tracking?.preparing_item_ids || []).map(Number);

                            let itemStatus = 'PLACED';
                            if (servedIds.includes(itemId)) itemStatus = 'SERVED';
                            else if (readyIds.includes(itemId)) itemStatus = 'READY';
                            else if (preparingIds.includes(itemId)) itemStatus = 'PREPARING';

                            return (
                                <div 
                                    key={item.order_item_id} 
                                    className={`detail-item-row ${itemStatus.toLowerCase()}`}
                                    onClick={() => setSelectedItemId(item.order_item_id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="item-main-details">
                                        <div className="item-name-row-kds">
                                            <h4>{item.item_name}</h4>
                                            <span className="qty-tag-detail">x{item.quantity}</span>
                                        </div>
                                        {item.selected_variants?.length > 0 && (
                                            <div className="item-variants-detail">
                                                {item.selected_variants.map((v, idx) => (
                                                    <span key={idx} className="variant-pill-detail">
                                                        {v.variant_name}: {v.option_name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.note && (
                                            <p className="item-chef-note">Note: "{item.note}"</p>
                                        )}
                                    </div>

                                    <div className="item-action-controls">
                                        <span className={`status-pill-big ${itemStatus.toLowerCase()}`}>
                                            {itemStatus}
                                        </span>
                                        
                                        {itemStatus === 'PLACED' && (
                                            <button 
                                                className="action-btn-kds start-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusUpdate(order.order_id, 'PREPARING', item.order_item_id);
                                                }}
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {itemStatus === 'PREPARING' && (
                                            <button 
                                                className="action-btn-kds ready-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const nextStatus = isTakeaway ? 'SERVED' : 'READY';
                                                    handleStatusUpdate(order.order_id, nextStatus, item.order_item_id);
                                                }}
                                            >
                                                {isTakeaway ? 'Mark Served' : 'Mark as Ready'}
                                            </button>
                                        )}
                                        {itemStatus === 'READY' && (
                                            <span className="action-text-info" onClick={(e) => e.stopPropagation()}>
                                                Waiting for Waiter
                                            </span>
                                        )}
                                        {itemStatus === 'SERVED' && (
                                            <span className="action-text-success" onClick={(e) => e.stopPropagation()}>
                                                {isTakeaway ? '✓ Completed' : '✓ Item Served'}
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

const ChefDashboard = () => {
    const [pin, setPin] = useState(sessionStorage.getItem('kds_pin') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('kds_pin'));
    const [orders, setOrders] = useState([]);
    const [backendCompletedOrders, setBackendCompletedOrders] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);
    const [currentView, setCurrentView] = useState('DASHBOARD');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [pinInput, setPinInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [sessionInputs, setSessionInputs] = useState({ chef_name: '', chef_id: '' });
    const [error, setError] = useState('');
    const [selectedChefId, setSelectedChefId] = useState('');
    const [historySearch, setHistorySearch] = useState('');
    const [historySort, setHistorySort] = useState('latest'); // 'latest' or 'oldest'

    const API_BASE_URL = `${BASE}/kds`;

    useEffect(() => {
        if (isAuthenticated) {
            const initDashboard = async () => {
                const savedUserStr = sessionStorage.getItem('kds_user');
                if (savedUserStr) {
                    try {
                        const savedUser = JSON.parse(savedUserStr);
                        await axios.post(`${API_BASE_URL}/session/start`, {
                            chef_name: savedUser.username,
                            chef_id: savedUser.username,
                            pin: pin
                        });
                    } catch (e) {
                        // ignore already started or other session start errors
                    }
                }
                fetchOrders();
                fetchCompletedItems();
                fetchSessions();
            };

            initDashboard();

            // Setup Socket.IO real-time event listeners
            const socket = getSocket(pin);
            if (socket) {
                const handleOrderCreated = () => fetchOrders();
                const handleItemStatusChanged = () => { fetchOrders(); fetchCompletedItems(); };
                const handleOrderStatusChanged = () => { fetchOrders(); fetchCompletedItems(); };
                const handleSessionUpdated = () => fetchSessions();
                const handleConnect = () => { fetchOrders(); fetchCompletedItems(); fetchSessions(); };

                socket.on('order:created', handleOrderCreated);
                socket.on('order:item_status_changed', handleItemStatusChanged);
                socket.on('order:status_changed', handleOrderStatusChanged);
                socket.on('session:updated', handleSessionUpdated);
                socket.on('connect', handleConnect);

                const interval = setInterval(() => {
                    fetchOrders();
                    fetchCompletedItems();
                    fetchSessions();
                }, 8000);

                return () => {
                    clearInterval(interval);
                    socket.off('order:created', handleOrderCreated);
                    socket.off('order:item_status_changed', handleItemStatusChanged);
                    socket.off('order:status_changed', handleOrderStatusChanged);
                    socket.off('session:updated', handleSessionUpdated);
                    socket.off('connect', handleConnect);
                };
            }

            const interval = setInterval(() => {
                fetchOrders();
                fetchCompletedItems();
                fetchSessions();
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, pin]);

    const fetchSessions = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/session`);
            setActiveSessions(res.data || []);
            if (res.data?.length > 0 && !selectedChefId) setSelectedChefId(res.data[0].chef_id);
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/orders`, { params: { pin } });
            setOrders(res.data);
        } catch (err) { handleApiError(err); }
    };

    const fetchCompletedItems = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/completed`, { params: { pin } });
            setBackendCompletedOrders(res.data);
        } catch (err) { handleApiError(err); }
    };

    const completedOrders = React.useMemo(() => {
        const completedByOrder = new Map();

        const addCompletedItem = (order, item) => {
            const orderId = order.order_id;
            const existing = completedByOrder.get(orderId) || {
                ...order,
                items: [],
                completedAt: order.kitchen_tracking?.served_at || order.updated_at
            };

            if (!existing.items.some(i => i.order_item_id === item.order_item_id)) {
                existing.items.push(item);
            }

            const itemServedAt = order.kitchen_tracking?.item_served_times?.[item.order_item_id]
                || order.kitchen_tracking?.served_at
                || order.updated_at;

            if (new Date(normalizeDate(itemServedAt)) > new Date(normalizeDate(existing.completedAt))) {
                existing.completedAt = itemServedAt;
            }

            completedByOrder.set(orderId, existing);
        };

        backendCompletedOrders.forEach(order => {
            const servedIds = (order.kitchen_tracking?.served_item_ids || []).map(Number);
            order.items.forEach(item => {
                if (servedIds.includes(Number(item.order_item_id)) || ['SERVED', 'CLOSED', 'PAID'].includes(order.status)) {
                    addCompletedItem(order, item);
                }
            });
        });
        orders.forEach(order => {
            if (order.status !== 'SERVED') {
                const servedIds = (order.kitchen_tracking?.served_item_ids || []).map(Number);
                order.items.forEach(item => {
                    if (servedIds.includes(Number(item.order_item_id))) {
                        addCompletedItem(order, item);
                    }
                });
            }
        });

        let filtered = Array.from(completedByOrder.values()).filter(order => {
            if (!historySearch) return true;
            const search = historySearch.toLowerCase();
            return order.order_id.toString().includes(search) ||
                (order.table_id && order.table_id.toString().includes(search)) ||
                order.items.some(item => item.item_name.toLowerCase().includes(search));
        });

        return filtered.sort((a, b) => {
            const timeA = new Date(normalizeDate(a.completedAt));
            const timeB = new Date(normalizeDate(b.completedAt));
            return historySort === 'latest' ? timeB - timeA : timeA - timeB;
        });
    }, [backendCompletedOrders, orders, historySearch, historySort]);

    const handleApiError = (err) => {
        if (err.response?.status === 401) {
            setIsAuthenticated(false);
            sessionStorage.removeItem('kds_pin');
        }
    };

    const handlePinSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${BASE}/auth/login`, {
                username: pinInput, // using pinInput as username for simplicity, or we can use dedicated state
                password: passwordInput
            });
            const user = response.data.user;
            if (user.role === 'CHEF' || user.role === 'ADMIN') {
                sessionStorage.setItem('kds_pin', response.data.token);
                sessionStorage.setItem('kds_user', JSON.stringify(user));
                setPin(response.data.token); // using token as pin equivalent
                setIsAuthenticated(true);
            } else {
                setError('Access denied. Kitchen staff account required.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    const startSession = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/session/start`, { ...sessionInputs, pin });
            setActiveSessions(res.data);
            setSessionInputs({ chef_name: '', chef_id: '' });
            alert('Session started!');
        } catch (err) { alert(err.response?.data?.error || 'Failed to start session'); }
    };

    const endSession = async (chefId) => {
        try {
            await axios.post(`${API_BASE_URL}/session/end`, { chef_id: chefId, pin });
            fetchSessions();
            alert('Session ended.');
        } catch (err) { alert(err.response?.data?.error || 'Failed to end session'); }
    };

    const handleLogout = async () => {
        try {
            const savedUserStr = sessionStorage.getItem('kds_user');
            if (savedUserStr) {
                const savedUser = JSON.parse(savedUserStr);
                await axios.post(`${API_BASE_URL}/session/end`, { chef_id: savedUser.username, pin });
            }
            setIsAuthenticated(false);
            sessionStorage.removeItem('kds_pin');
            sessionStorage.removeItem('kds_user');
        } catch (err) {
            const errMsg = err.response?.data?.error || 'Failed to log out.';
            alert(errMsg);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus, itemId = null) => {
        if (newStatus === 'PREPARING' && !selectedChefId) {
            alert('Please select a chef first.');
            return;
        }
        try {
            const currentChef = activeSessions.find(s => s.chef_id === selectedChefId);
            await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, {
                status: newStatus,
                itemId,
                chefId: selectedChefId,
                chefName: currentChef?.chef_name,
                pin
            });
            fetchOrders();
        } catch (err) { alert('Update failed'); }
    };

    const filteredOrders = React.useMemo(() => {
        return orders.filter(o => {
            const isTakeaway = !o.table_id || o.table_id === 0;
            const matchesType = filterType === 'ALL' || (filterType === 'TAKEAWAY' && isTakeaway) || (filterType === 'DINEIN' && !isTakeaway);
            
            const matchesSearch = o.order_id.toString().includes(searchTerm) ||
                `T${o.table_id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.items.some(item => item.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
                
            return matchesType && matchesSearch;
        });
    }, [orders, filterType, searchTerm]);

    if (!isAuthenticated) {
        return (
            <PortalLoginCard
                title="Kitchen Portal"
                subtitle="Chill Grand — Kitchen Station"
                accentColor="#3b82f6"
                footerLabel="kds-portal-9922"
                usernameValue={pinInput}
                passwordValue={passwordInput}
                onUsernameChange={e => setPinInput(e.target.value)}
                onPasswordChange={e => setPasswordInput(e.target.value)}
                onSubmit={handlePinSubmit}
                error={error}
                loading={false}
                submitLabel="Sign In to Kitchen Portal"
            />
        );
    }

    return (
        <div className="kds-layout">
            <aside className="kds-sidebar">
                <div className="sidebar-brand">
                    <img src={logo} alt="Logo" />
                    <h3>CHILL GRAND</h3>
                </div>
                <nav className="sidebar-nav">
                    <button className={currentView === 'DASHBOARD' ? 'active' : ''} onClick={() => { setCurrentView('DASHBOARD'); setSelectedOrderId(null); setSelectedItemId(null); }}>Dashboard</button>
                    <button className={currentView === 'COMPLETED' ? 'active' : ''} onClick={() => { setCurrentView('COMPLETED'); setSelectedOrderId(null); setSelectedItemId(null); }}>Completed Items</button>
                    <button className={currentView === 'SESSION' ? 'active' : ''} onClick={() => { setCurrentView('SESSION'); setSelectedOrderId(null); setSelectedItemId(null); }}>My Session</button>
                </nav>
                <div className="sidebar-footer">
                    <div className="active-count-bubble">{activeSessions.length} Chefs Online</div>
                    <button className="logout-btn" onClick={handleLogout}>Logout Portal</button>
                </div>
            </aside>

            <main className="kds-main">
                <header className="kds-top-bar">
                    <div className="view-title">
                        <h2>{currentView === 'DASHBOARD' ? 'Live Prep Queue' : currentView === 'COMPLETED' ? 'Completed Tasks' : 'Kitchen Sessions'}</h2>
                    </div>
                    {currentView === 'DASHBOARD' && (
                        <div className="header-controls">
                            <div className="search-wrapper">
                                <Search size={16} />
                                <input type="text" placeholder="Search Item/Table..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                                <option value="ALL">All Services</option>
                                <option value="DINEIN">Dine-In</option>
                                <option value="TAKEAWAY">Take-Away</option>
                            </select>
                        </div>
                    )}

                    {currentView === 'COMPLETED' && (
                        <div className="header-controls history-controls">
                            <div className="search-wrapper">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search completed orders..."
                                    value={historySearch}
                                    onChange={e => setHistorySearch(e.target.value)}
                                />
                            </div>
                            <div className="sort-pills">
                                <button
                                    className={`pill-btn ${historySort === 'latest' ? 'active' : ''}`}
                                    onClick={() => setHistorySort('latest')}
                                >
                                    <ArrowDownWideNarrow size={14} /> Latest First
                                </button>
                                <button
                                    className={`pill-btn ${historySort === 'oldest' ? 'active' : ''}`}
                                    onClick={() => setHistorySort('oldest')}
                                >
                                    <ArrowUpNarrowWide size={14} /> Oldest First
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="live-clock">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </header>

                <div className="kds-content">
                    {currentView === 'DASHBOARD' && (
                        selectedOrderId ? (
                            selectedItemId ? (
                                <ItemDetailView
                                    orderId={selectedOrderId}
                                    itemId={selectedItemId}
                                    orders={orders}
                                    activeSessions={activeSessions}
                                    selectedChefId={selectedChefId}
                                    setSelectedChefId={setSelectedChefId}
                                    handleStatusUpdate={handleStatusUpdate}
                                    onBack={() => setSelectedItemId(null)}
                                />
                            ) : (
                                <OrderDetailView
                                    orderId={selectedOrderId}
                                    orders={orders}
                                    activeSessions={activeSessions}
                                    selectedChefId={selectedChefId}
                                    setSelectedChefId={setSelectedChefId}
                                    handleStatusUpdate={handleStatusUpdate}
                                    setSelectedItemId={setSelectedItemId}
                                    onBack={() => setSelectedOrderId(null)}
                                />
                            )
                        ) : (
                            <div className="kds-grid">
                                {filteredOrders.length > 0 ? filteredOrders.map(order => {
                                    const isTakeaway = !order.table_id || order.table_id === 0;

                                    // Determine overall order display status
                                    const isAnyPreparing = order.items.some(item => 
                                        (order.kitchen_tracking?.preparing_item_ids || []).map(Number).includes(Number(item.order_item_id))
                                    );
                                    const isAnyReady = order.items.some(item => 
                                        (order.kitchen_tracking?.ready_item_ids || []).map(Number).includes(Number(item.order_item_id))
                                    );
                                    
                                    let orderStatusText = 'PLACED';
                                    if (isAnyPreparing) orderStatusText = 'PREPARING';
                                    else if (isAnyReady) orderStatusText = 'READY';

                                    return (
                                        <div key={order.order_id} className="order-card-new" onClick={() => setSelectedOrderId(order.order_id)}>
                                            <div className="card-top-info">
                                                <span className="order-num">#{order.order_id}</span>
                                                <span className="table-badge">{isTakeaway ? 'TAKEAWAY' : `TABLE ${order.table_id}`}</span>
                                            </div>
                                            
                                            <div className="order-card-items-list">
                                                {order.items.map(item => {
                                                    const itemId = Number(item.order_item_id);
                                                    const servedIds = (order.kitchen_tracking?.served_item_ids || []).map(Number);
                                                    const readyIds = (order.kitchen_tracking?.ready_item_ids || []).map(Number);
                                                    const preparingIds = (order.kitchen_tracking?.preparing_item_ids || []).map(Number);

                                                    let itemStatus = 'PLACED';
                                                    if (servedIds.includes(itemId)) itemStatus = 'SERVED';
                                                    else if (readyIds.includes(itemId)) itemStatus = 'READY';
                                                    else if (preparingIds.includes(itemId)) itemStatus = 'PREPARING';

                                                    return (
                                                        <div key={item.order_item_id} className={`order-card-item ${itemStatus.toLowerCase()}`}>
                                                            <span className="item-name-qty">
                                                                {item.item_name} <strong className="qty-tag-inline">x{item.quantity}</strong>
                                                            </span>
                                                            <span className={`item-status-pill ${itemStatus.toLowerCase()}`}>
                                                                {itemStatus}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="timer-section" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                                                <div className="timer-row">
                                                    <span className="timer-label">Time Elapsed:</span>
                                                    <LiveTimer placedAtStr={order.created_at} servedAtStr={order.kitchen_tracking?.served_at} className="timer-val" />
                                                </div>
                                            </div>

                                            <div className="card-bottom-info">
                                                <span className={`status-badge ${orderStatusText.toLowerCase()}-badge`}>
                                                    {orderStatusText}
                                                </span>
                                                {order.kitchen_tracking?.prepared_by_chef_id && (
                                                    <div className="chef-initials-badge">
                                                        {order.kitchen_tracking.prepared_by_chef_id.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }) : <div className="empty-state">No pending orders. Kitchen is clear!</div>}
                            </div>
                        )
                    )}

                    {currentView === 'COMPLETED' && (
                        <div className="kds-grid">
                            {completedOrders.length > 0 ? completedOrders.map(order => {
                                const createdAt = new Date(normalizeDate(order.created_at));
                                const acceptedAt = order.kitchen_tracking?.accepted_at
                                    ? new Date(normalizeDate(order.kitchen_tracking.accepted_at))
                                    : null;
                                const completedAt = new Date(normalizeDate(order.completedAt));
                                const totalCycleMs = completedAt - createdAt;
                                const activePrepMs = acceptedAt ? (completedAt - acceptedAt) : 0;
                                const isTakeaway = !order.table_id || order.table_id === 0;

                                return (
                                    <div 
                                        key={order.order_id} 
                                        className="order-card-new history-card" 
                                        onClick={() => {
                                            setSelectedOrderId(order.order_id);
                                            setCurrentView('DASHBOARD');
                                        }}
                                    >
                                        <div className="card-top-info">
                                            <span className="order-num">#{order.order_id}</span>
                                            <span className="table-badge">{isTakeaway ? 'TAKEAWAY' : `TABLE ${order.table_id}`}</span>
                                        </div>

                                        <div className="order-card-items-list">
                                            {order.items.map(item => (
                                                <div key={item.order_item_id} className="order-card-item served">
                                                    <span className="item-name-qty">
                                                        {item.item_name} <strong className="qty-tag-inline">x{item.quantity}</strong>
                                                    </span>
                                                    <span className="item-status-pill served">SERVED</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="timer-section history-timers">
                                            <div className="timer-row">
                                                <span className="timer-label">Prep Time:</span>
                                                <span className="timer-val timer-fixed">
                                                    {activePrepMs <= 0 ? "0m 0s" : formatDuration(activePrepMs)}
                                                </span>
                                            </div>
                                            <div className="timer-row">
                                                <span className="timer-label">Total Time:</span>
                                                <span className="timer-val timer-fixed">
                                                    {totalCycleMs <= 0 ? "0m 0s" : formatDuration(totalCycleMs)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-bottom-info">
                                            <div className="history-served-row">
                                                <span className="status-badge served-badge">SERVED</span>
                                                <span className="served-time-stamp">{completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            {order.kitchen_tracking?.prepared_by_chef_id && (
                                                <div className="chef-initials-badge history-chef">
                                                    {order.kitchen_tracking.prepared_by_chef_id.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : <div className="empty-state">No completed orders today.</div>}
                        </div>
                    )}

                    {currentView === 'SESSION' && (
                        <div className="session-portal">
                            <div className="active-chefs-section">
                                <div className="section-header">
                                    <h4 className="section-title">Current Active Chefs</h4>
                                    <div className="count-tag">{activeSessions.length} Staff Online</div>
                                </div>
                                <div className="active-chefs-grid">
                                    {activeSessions.length > 0 ? activeSessions.map(chef => {
                                        const initials = chef.chef_name
                                            ? chef.chef_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                            : '??';

                                        const startTime = chef.start_time
                                            ? new Date(chef.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : '--:--';

                                        return (
                                            <div key={chef.chef_id} className="chef-pro-card">
                                                <div className="chef-card-inner">
                                                    <div className="chef-avatar">
                                                        <span>{initials}</span>
                                                        <div className="status-indicator"></div>
                                                    </div>
                                                    <div className="chef-details">
                                                        <div className="chef-name-row">
                                                            <h4>{chef.chef_name}</h4>
                                                            <span className="status-label">ACTIVE</span>
                                                        </div>
                                                        <p className="chef-id-tag">Personnel ID: {chef.chef_id}</p>
                                                        <div className="chef-meta-row">
                                                            <span className="shift-time">Started at {startTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="pro-end-btn" onClick={() => endSession(chef.chef_id)}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    End Session
                                                </button>
                                            </div>
                                        );
                                    }) : (
                                        <div className="empty-staff-state">
                                            <p>No active staff members currently on duty.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ChefDashboard;
