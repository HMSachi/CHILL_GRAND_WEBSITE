import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide, Clock } from 'lucide-react';
import '../styles/pages/ChefDashboard.css';
import logo from '../assets/logo.png';

const ChefDashboard = () => {
    const [pin, setPin] = useState(sessionStorage.getItem('kds_pin') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('kds_pin'));
    const [orders, setOrders] = useState([]);
    const [backendCompletedOrders, setBackendCompletedOrders] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);
    const [currentView, setCurrentView] = useState('DASHBOARD');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [pinInput, setPinInput] = useState('');
    const [sessionInputs, setSessionInputs] = useState({ chef_name: '', chef_id: '' });
    const [error, setError] = useState('');
    const [selectedChefId, setSelectedChefId] = useState('');
    const [historySearch, setHistorySearch] = useState('');
    const [historySort, setHistorySort] = useState('latest'); // 'latest' or 'oldest'

    const API_BASE_URL = 'http://localhost:5000/api/kds';

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
            fetchCompletedItems();
            fetchSessions();
            const interval = setInterval(() => {
                fetchOrders();
                fetchCompletedItems();
                fetchSessions();
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

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

    const completedItems = React.useMemo(() => {
        const flatCompleted = [];
        backendCompletedOrders.forEach(order => {
            const servedIds = order.kitchen_tracking?.served_item_ids || [];
            order.items.forEach(item => {
                if (servedIds.includes(item.order_item_id) || ['SERVED', 'CLOSED', 'PAID'].includes(order.status)) {
                    flatCompleted.push({ ...item, parentOrder: order });
                }
            });
        });
        orders.forEach(order => {
            if (order.status !== 'SERVED') {
                const servedIds = order.kitchen_tracking?.served_item_ids || [];
                order.items.forEach(item => {
                    if (servedIds.includes(item.order_item_id)) {
                        if (!flatCompleted.some(c => c.order_item_id === item.order_item_id)) {
                            flatCompleted.push({ ...item, parentOrder: order });
                        }
                    }
                });
            }
        });

        // Search Filter
        let filtered = flatCompleted.filter(item => {
            if (!historySearch) return true;
            const search = historySearch.toLowerCase();
            return item.item_name.toLowerCase().includes(search) ||
                item.parentOrder.order_id.toString().includes(search) ||
                (item.parentOrder.table_id && item.parentOrder.table_id.toString().includes(search));
        });

        // Time Sort
        return filtered.sort((a, b) => {
            const timeA = new Date(a.parentOrder.kitchen_tracking?.item_served_times?.[a.order_item_id] || a.parentOrder.kitchen_tracking?.served_at || a.parentOrder.updated_at);
            const timeB = new Date(b.parentOrder.kitchen_tracking?.item_served_times?.[b.order_item_id] || b.parentOrder.kitchen_tracking?.served_at || b.parentOrder.updated_at);
            return historySort === 'latest' ? timeB - timeA : timeA - timeB;
        });
    }, [backendCompletedOrders, orders, historySearch, historySort]);

    const handleApiError = (err) => {
        if (err.response?.status === 401) {
            setIsAuthenticated(false);
            sessionStorage.removeItem('kds_pin');
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pinInput === 'cheff@123') {
            setPin(pinInput);
            setIsAuthenticated(true);
            sessionStorage.setItem('kds_pin', pinInput);
            setError('');
        } else { setError('Incorrect PIN.'); }
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
            setSelectedItem(null);
        } catch (err) { alert('Update failed'); }
    };

    const itemCards = [];
    orders.forEach(order => {
        const servedIds = order.kitchen_tracking?.served_item_ids || [];
        order.items.forEach(item => {
            if (!servedIds.includes(item.order_item_id)) itemCards.push({ ...item, parentOrder: order });
        });
    });

    const filteredCards = itemCards.filter(card => {
        const o = card.parentOrder;
        const matchesSearch = card.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `T${o.table_id}`.toLowerCase().includes(searchTerm.toLowerCase());
        const isTakeaway = !o.table_id || o.table_id === 0;
        const matchesType = filterType === 'ALL' || (filterType === 'TAKEAWAY' && isTakeaway) || (filterType === 'DINEIN' && !isTakeaway);
        return matchesSearch && matchesType;
    });

    if (!isAuthenticated) {
        return (
            <div className="kds-login-overlay">
                <div className="kds-login-card">
                    <img src={logo} alt="Logo" className="kds-login-logo" />
                    <h2>KITCHEN PORTAL</h2>
                    <form onSubmit={handlePinSubmit}>
                        <input type="password" placeholder="••••" value={pinInput} onChange={e => setPinInput(e.target.value)} autoFocus />
                        {error && <div className="kds-error-message">{error}</div>}
                        <button type="submit">Unlock Dashboard</button>
                    </form>
                </div>
            </div>
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
                    <button className={currentView === 'DASHBOARD' ? 'active' : ''} onClick={() => setCurrentView('DASHBOARD')}>Dashboard</button>
                    <button className={currentView === 'COMPLETED' ? 'active' : ''} onClick={() => setCurrentView('COMPLETED')}>Completed Items</button>
                    <button className={currentView === 'SESSION' ? 'active' : ''} onClick={() => setCurrentView('SESSION')}>My Session</button>
                </nav>
                <div className="sidebar-footer">
                    <div className="active-count-bubble">{activeSessions.length} Chefs Online</div>
                    <button className="logout-btn" onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('kds_pin'); }}>Logout Portal</button>
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
                                    placeholder="Search completed items..."
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
                        <div className="kds-grid">
                            {filteredCards.length > 0 ? filteredCards.map(card => {
                                const now = new Date();
                                const createdAt = new Date(card.parentOrder.created_at);
                                const acceptedAt = card.parentOrder.kitchen_tracking?.accepted_at
                                    ? new Date(card.parentOrder.kitchen_tracking.accepted_at)
                                    : null;

                                // Total time since order was placed
                                const totalWaitTime = Math.floor((now - createdAt) / 60000);

                                // Time spent in queue before chef accepted it
                                const queueTime = acceptedAt
                                    ? Math.floor((acceptedAt - createdAt) / 60000)
                                    : totalWaitTime;

                                // Time spent being prepared
                                const prepTime = acceptedAt
                                    ? Math.floor((now - acceptedAt) / 60000)
                                    : 0;

                                const isTakeaway = !card.parentOrder.table_id || card.parentOrder.table_id === 0;
                                let timerClass = 'timer-ok';
                                if (totalWaitTime >= 5) timerClass = 'timer-warning';
                                if (totalWaitTime >= 10) timerClass = 'timer-late';

                                return (
                                    <div key={card.order_item_id} className="item-card" onClick={() => setSelectedItem(card)}>
                                        <div className="card-top-info">
                                            <span className="order-num">#{card.parentOrder.order_id}</span>
                                            <span className="table-badge">{isTakeaway ? 'TAKEAWAY' : `TABLE ${card.parentOrder.table_id}`}</span>
                                        </div>
                                        <h3 className="item-name-big">{card.item_name}</h3>
                                        <div className="qty-tag">Quantity: {card.quantity}</div>

                                        <div className="timer-section">
                                            <div className="timer-row">
                                                <span className="timer-label">In Queue:</span>
                                                <span className={`timer-val ${acceptedAt ? 'timer-fixed' : timerClass}`}>
                                                    {queueTime < 0 ? 0 : queueTime}m
                                                </span>
                                            </div>
                                            {acceptedAt && (
                                                <div className="timer-row">
                                                    <span className="timer-label">Preparing:</span>
                                                    <span className="timer-val timer-preparing-live">
                                                        {prepTime < 0 ? 0 : prepTime}m
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-bottom-info">
                                            {(() => {
                                                const isPreparing = (card.parentOrder.kitchen_tracking?.preparing_item_ids || []).includes(card.order_item_id);
                                                const isReady = (card.parentOrder.kitchen_tracking?.ready_item_ids || []).includes(card.order_item_id);

                                                if (isReady) {
                                                    return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid currentColor' }}>WAITING FOR WAITER</span>;
                                                }
                                                return (
                                                    <span className={`status-badge ${isPreparing ? 'preparing-badge' : 'placed-badge'}`}>
                                                        {isPreparing ? 'PREPARING' : 'PLACED'}
                                                    </span>
                                                );
                                            })()}
                                            {acceptedAt && <div className="chef-initials-badge">{card.parentOrder.kitchen_tracking?.prepared_by_chef_id?.slice(0, 2).toUpperCase()}</div>}
                                        </div>
                                    </div>
                                );
                            }) : <div className="empty-state">No pending items. Kitchen is clear!</div>}
                        </div>
                    )}

                    {currentView === 'COMPLETED' && (
                        <div className="kds-grid">
                            {completedItems.length > 0 ? completedItems.map(card => {
                                const createdAt = new Date(card.parentOrder.created_at);
                                const acceptedAt = card.parentOrder.kitchen_tracking?.accepted_at
                                    ? new Date(card.parentOrder.kitchen_tracking.accepted_at)
                                    : null;

                                // Get served time for this specific item
                                const servedAtTime = card.parentOrder.kitchen_tracking?.item_served_times?.[card.order_item_id]
                                    || card.parentOrder.kitchen_tracking?.served_at
                                    || card.parentOrder.updated_at;

                                const servedAt = new Date(servedAtTime);

                                // Time from Placement to Serving
                                const totalCycleTime = Math.floor((servedAt - createdAt) / 60000);

                                // Time from Acceptance to Serving (Active Prep Time)
                                const activePrepTime = acceptedAt
                                    ? Math.floor((servedAt - acceptedAt) / 60000)
                                    : 0;

                                const isTakeaway = !card.parentOrder.table_id || card.parentOrder.table_id === 0;

                                return (
                                    <div key={card.order_item_id} className="item-card history-card" onClick={() => setSelectedItem(card)}>
                                        <div className="card-top-info">
                                            <span className="order-num">#{card.parentOrder.order_id}</span>
                                            <span className="table-badge">{isTakeaway ? 'TAKEAWAY' : `TABLE ${card.parentOrder.table_id}`}</span>
                                        </div>
                                        <h3 className="item-name-big">{card.item_name}</h3>
                                        <div className="qty-tag">Quantity: {card.quantity}</div>

                                        <div className="timer-section history-timers">
                                            <div className="timer-row">
                                                <span className="timer-label">Prep Time:</span>
                                                <span className="timer-val timer-fixed">
                                                    {activePrepTime < 0 ? 0 : activePrepTime}m
                                                </span>
                                            </div>
                                            <div className="timer-row">
                                                <span className="timer-label">Total Time:</span>
                                                <span className="timer-val timer-fixed">
                                                    {totalCycleTime < 0 ? 0 : totalCycleTime}m
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-bottom-info">
                                            <div className="history-served-row">
                                                <span className="status-badge served-badge">SERVED</span>
                                                <span className="served-time-stamp">{servedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="chef-initials-badge history-chef">
                                                {card.parentOrder.kitchen_tracking?.prepared_by_chef_id?.slice(0, 2).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : <div className="empty-state">No completed items today.</div>}
                        </div>
                    )}

                    {currentView === 'SESSION' && (
                        <div className="session-portal">
                            <div className="session-join-card">
                                <h3>Log as Chef</h3>
                                <p>Enter your details to begin receiving orders at your station.</p>
                                <form onSubmit={startSession} className="session-form">
                                    <input type="text" placeholder="Your Name" required value={sessionInputs.chef_name} onChange={e => setSessionInputs({ ...sessionInputs, chef_name: e.target.value })} />
                                    <input type="text" placeholder="Personnel ID" required value={sessionInputs.chef_id} onChange={e => setSessionInputs({ ...sessionInputs, chef_id: e.target.value })} />
                                    <button type="submit">Start Shift</button>
                                </form>
                            </div>

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

            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="product-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-visual">
                            <img src={selectedItem.menu_item?.image || 'https://via.placeholder.com/400x300?text=Food'} alt={selectedItem.item_name} className="product-img" />
                            <div className="img-overlay" />
                        </div>
                        <div className="modal-body">
                            <div className="m-header">
                                <div className="m-title">
                                    <h1>{selectedItem.item_name}</h1>
                                    <div className="m-meta">
                                        <span className="m-badge m-badge-table">{!selectedItem.parentOrder.table_id ? 'TAKEAWAY' : `TABLE ${selectedItem.parentOrder.table_id}`}</span>
                                        <span className="m-badge m-badge-order">#{selectedItem.parentOrder.order_id}</span>
                                    </div>
                                </div>
                                <div className="m-qty">x{selectedItem.quantity}</div>
                            </div>

                            <div className="m-details-grid">
                                <div className="m-section">
                                    <h4>SELECTED VARIANTS</h4>
                                    <div className="v-list">
                                        {selectedItem.selected_variants?.length > 0 ? selectedItem.selected_variants.map((v, i) => (
                                            <div key={i} className="v-item">
                                                <span className="v-key">{v.variant_name}:</span>
                                                <span className="v-val">{v.option_name}</span>
                                            </div>
                                        )) : <p style={{ color: '#475569', fontSize: '0.9rem' }}>No variants selected.</p>}
                                    </div>
                                </div>

                                <div className="m-section">
                                    <h4>PREP METRICS</h4>
                                    <div className="v-list">
                                        <div className="v-item">
                                            <span className="v-key">Placed:</span>
                                            <span className="v-val">{new Date(selectedItem.parentOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {selectedItem.parentOrder.kitchen_tracking?.accepted_at && (
                                            <div className="v-item">
                                                <span className="v-key">Started:</span>
                                                <span className="v-val">{new Date(selectedItem.parentOrder.kitchen_tracking.accepted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        )}
                                        {(() => {
                                            const kt = selectedItem.parentOrder.kitchen_tracking || {};
                                            const itemId = selectedItem.order_item_id;

                                            const placedAt = new Date(selectedItem.parentOrder.created_at);
                                            const acceptedAt = kt.accepted_at ? new Date(kt.accepted_at) : null;
                                            const readyAtTime = kt.item_ready_times?.[itemId] || kt.ready_at;
                                            const readyAt = readyAtTime ? new Date(readyAtTime) : null;
                                            const servedAtTime = kt.item_served_times?.[itemId] || kt.served_at || selectedItem.parentOrder.updated_at;
                                            const servedAt = (kt.served_item_ids || []).includes(itemId) || ['SERVED', 'CLOSED', 'PAID'].includes(selectedItem.parentOrder.status)
                                                ? new Date(servedAtTime) : null;

                                            const activePrepTime = (acceptedAt && readyAt) ? Math.floor((readyAt - acceptedAt) / 60000) : null;
                                            const pickupDelay = (readyAt && servedAt) ? Math.floor((servedAt - readyAt) / 60000) : null;
                                            const totalCycle = servedAt ? Math.floor((servedAt - placedAt) / 60000) : null;

                                            return (
                                                <>
                                                    {readyAt && (
                                                        <div className="v-item">
                                                            <span className="v-key">Ready At:</span>
                                                            <span className="v-val" style={{ color: '#f59e0b' }}>{readyAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    )}

                                                    {servedAt && (
                                                        <div className="v-item">
                                                            <span className="v-key">Served At:</span>
                                                            <span className="v-val" style={{ color: '#34d399' }}>{servedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    )}

                                                    {activePrepTime !== null && (
                                                        <div className="v-item" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <span className="v-key">Active Cooking Time:</span>
                                                            <span className="v-val" style={{ color: '#10b981' }}>{activePrepTime < 0 ? 0 : activePrepTime} min</span>
                                                        </div>
                                                    )}

                                                    {pickupDelay !== null && (
                                                        <div className="v-item">
                                                            <span className="v-key">Pickup Delay (Waiting):</span>
                                                            <span className="v-val" style={{ color: '#f59e0b' }}>{pickupDelay < 0 ? 0 : pickupDelay} min</span>
                                                        </div>
                                                    )}

                                                    {totalCycle !== null && (
                                                        <div className="v-item">
                                                            <span className="v-key">Total Journey:</span>
                                                            <span className="v-val" style={{ color: '#10b981', fontWeight: 950 }}>{totalCycle < 0 ? 0 : totalCycle} min</span>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="m-section">
                                    <h4>CUSTOMER CONTACT</h4>
                                    <p className="m-contact-val">{selectedItem.parentOrder.customer_phone || 'Customer contact not provided'}</p>
                                </div>

                                {selectedItem.note && (
                                    <div className="m-section">
                                        <h4>CHEF NOTES</h4>
                                        <p className="m-note-val">{selectedItem.note}</p>
                                    </div>
                                )}
                            </div>

                            <div className="m-chef-select">
                                <h4>PREPARING CHEF</h4>
                                <select value={selectedChefId} onChange={e => setSelectedChefId(e.target.value)} className="chef-dropdown">
                                    {activeSessions.map(s => <option key={s.chef_id} value={s.chef_id}>{s.chef_name} ({s.chef_id})</option>)}
                                    {activeSessions.length === 0 && <option value="">NO ACTIVE STAFF</option>}
                                </select>
                            </div>

                            <div className="m-footer">
                                {selectedItem.parentOrder.status === 'SERVED' || (selectedItem.parentOrder.kitchen_tracking?.served_item_ids || []).includes(selectedItem.order_item_id) ? (
                                    <div className="m-completed-badge item-served">
                                        <svg className="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Item Delivered & Served
                                    </div>
                                ) : (
                                    (selectedItem.parentOrder.kitchen_tracking?.ready_item_ids || []).includes(selectedItem.order_item_id) ? (
                                        <div className="m-completed-badge waiter-waiting">
                                            <svg className="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Waiting for Waiter to Serve
                                        </div>
                                    ) : (
                                        (selectedItem.parentOrder.kitchen_tracking?.preparing_item_ids || []).includes(selectedItem.order_item_id) ? (
                                            <button className="m-btn m-btn-serve" onClick={() => handleStatusUpdate(selectedItem.parentOrder.order_id, 'READY', selectedItem.order_item_id)}>Mark Item as Ready to Serve</button>
                                        ) : (
                                            <button className="m-btn m-btn-start" onClick={() => handleStatusUpdate(selectedItem.parentOrder.order_id, 'PREPARING', selectedItem.order_item_id)}>Start Preparing</button>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefDashboard;
