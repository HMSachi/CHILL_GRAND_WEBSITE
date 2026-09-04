import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import PortalLoginCard from '../components/portals/PortalLoginCard';
import '../styles/pages/WaiterDashboard.css';
import '../styles/components/PremiumWaiterMenu.css';
import '../styles/components/VariantModal.css';
import {
    LayoutDashboard,
    Grid2X2,
    ClipboardList,
    UtensilsCrossed,
    ReceiptText,
    LogOut,
    Search,
    Bell,
    Clock,
    User2,
    ChevronRight,
    MapPin,
    Flame,
    CheckCircle2,
    Clock3,
    AlertCircle,
    ShoppingBasket,
    XCircle,
    Hash,
    PlusCircle,
    History,
    Minus,
    Plus,
    X,
    MessageSquare,
    CookingPot,
    BellRing,
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    FileText,
    Eye
} from 'lucide-react';
import VariantModal from '../components/orders/VariantModal';
import FinalBillModal from '../QRweb/components/FinalBillModal';
import { API_BASE_URL } from '../config/api';
import { getSocket } from '../services/socket';

const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const normalizedDate = (dateStr.includes('T') && !dateStr.endsWith('Z') && !dateStr.includes('+'))
        ? `${dateStr}Z`
        : dateStr;
    return new Date(normalizedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const WaiterDashboard = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('waiter_user')));

    // ── Login state (inlined from WaiterLogin.jsx) ─────────────────────────
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError]       = useState('');
    const [loginLoading, setLoginLoading]   = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username: loginUsername,
                password: loginPassword
            });
            const userData = response.data.user;
            if (userData.role === 'WAITER' || userData.role === 'CASHIER' || userData.role === 'ADMIN') {
                sessionStorage.setItem('waiter_token', response.data.token);
                sessionStorage.setItem('waiter_user', JSON.stringify(userData));
                setUser(userData);
            } else {
                setLoginError('Access denied. Waiter account required.');
            }
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoginLoading(false);
        }
    };
    // ── End login state ────────────────────────────────────────────────────

    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('DASHBOARD');

    // UI specific states
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMyTablesOnly, setShowMyTablesOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [selectedTableForOrder, setSelectedTableForOrder] = useState(null);
    const [variantModalItem, setVariantModalItem] = useState(null);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [servedItemNotifications, setServedItemNotifications] = useState([]);
    const [prevReadyIds, setPrevReadyIds] = useState(new Set());
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [pendingTable, setPendingTable] = useState(null);
    const [customerPhone, setCustomerPhone] = useState('');
    const [waiterCalls, setWaiterCalls] = useState({});
    const [billCloseRequests, setBillCloseRequests] = useState({});
    const [finalBills, setFinalBills] = useState({});
    const [previewBill, setPreviewBill] = useState(null);

    // API_BASE_URL is imported from config/api.js

    useEffect(() => {
        if (user) {
            startSession();
            fetchAllData();

            const token = sessionStorage.getItem('waiter_token');
            const socket = getSocket(token);
            if (socket) {
                const handleUpdate = () => fetchAllData();
                socket.on('order:created', handleUpdate);
                socket.on('order:item_status_changed', handleUpdate);
                socket.on('order:status_changed', handleUpdate);
                socket.on('connect', handleUpdate);

                const interval = setInterval(fetchAllData, 15000);
                return () => {
                    clearInterval(interval);
                    socket.off('order:created', handleUpdate);
                    socket.off('order:item_status_changed', handleUpdate);
                    socket.off('order:status_changed', handleUpdate);
                    socket.off('connect', handleUpdate);
                };
            }

            const interval = setInterval(fetchAllData, 15000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [user]);

    useEffect(() => {
        const handleTabChange = (e) => setActiveTab(e.detail);
        window.addEventListener('changeTab', handleTabChange);
        return () => window.removeEventListener('changeTab', handleTabChange);
    }, []);

    useEffect(() => {
        if (!orders || orders.length === 0) return;

        const currentReadyIds = new Set();
        const newReadyNotifications = [];

        orders.forEach(order => {
            // Merge kitchen_tracking + juice_tracking so beverage READY items also notify
            const readyIds = [
                ...(order.kitchen_tracking?.ready_item_ids || []),
                ...(order.juice_tracking?.ready_item_ids   || [])
            ];
            readyIds.forEach(id => {
                currentReadyIds.add(id);
                // If it's a new ready item and the order belongs to this waiter
                if (!prevReadyIds.has(id) && prevReadyIds.size > 0) {
                    const item = order.order_items.find(i => i.order_item_id === id);
                    if (item) {
                        newReadyNotifications.push({
                            id: Date.now() + Math.random(),
                            orderId: order.order_id,
                            itemId: item.order_item_id,
                            itemName: item.item_name,
                            tableId: order.table_id
                        });
                    }
                }
            });
        });

        if (newReadyNotifications.length > 0) {
            setServedItemNotifications(prev => [...prev, ...newReadyNotifications]);
        }
        setPrevReadyIds(currentReadyIds);
    }, [orders, user]);

    const removeNotification = (id) => {
        setServedItemNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markItemAsServed = async (notifId, orderId, itemId) => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            await axios.patch(`${API_BASE_URL}/waiter/orders/${orderId}/items/${itemId}/served`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (notifId) removeNotification(notifId);
            fetchAllData();
        } catch (err) {
            console.error('Failed to mark item as served/delivered', err);
        }
    };

    const acceptWaiterCall = async (tableId) => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            await axios.patch(`${API_BASE_URL}/waiter/waiter-calls/${tableId}/accept`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            console.error('Failed to accept waiter call', err);
        }
    };

    const acceptBillCloseRequest = async (tableId) => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            await axios.patch(`${API_BASE_URL}/waiter/bill-close-requests/${tableId}/accept`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Find the order for this table to navigate to details
            const tableOrder = orders.find(o => String(o.table_id) === String(tableId));
            if (tableOrder) {
                setSelectedOrderDetail(tableOrder);
                setActiveTab('ORDERS');
            }

            fetchAllData();
        } catch (err) {
            console.error('Failed to accept bill close request', err);
        }
    };

    const fetchAllData = async () => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const results = await Promise.all([
                axios.get(`${API_BASE_URL}/orders`, { headers }),
                axios.get(`${API_BASE_URL}/waiter/order-requests`, { headers }),
                axios.get(`${API_BASE_URL}/cashier/tables`, { headers }),
                axios.get(`${API_BASE_URL}/menu/live`, { headers }),
                axios.get(`${API_BASE_URL}/waiter/waiter-calls`, { headers }),
                axios.get(`${API_BASE_URL}/waiter/bill-close-requests`, { headers }),
                axios.get(`${API_BASE_URL}/waiter/final-bills`, { headers })
            ]);

            const [ordersRes, requestsRes, tablesRes, menuRes, callsRes, billRequestsRes, finalBillsRes] = results;
            setWaiterCalls(callsRes.data || {});
            setBillCloseRequests(billRequestsRes.data || {});
            setFinalBills(finalBillsRes.data || {});

            const fetchedOrders = ordersRes.data;
            let filteredOrders = fetchedOrders;

            // Filter to ensure ONLY current user's orders are shown in ORDERS list 
            // BUT we still need ALL orders to determine table occupancy.
            // Therefore, we do NOT filter fetchedOrders down to just this user here.
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Keep all recent orders to light up the tables correctly
            filteredOrders = fetchedOrders.filter(order => {
                return new Date(order.created_at) > twentyFourHoursAgo;
            });

            // Add pending requests to the orders list
            const pendingRequestsAsOrders = (requestsRes.data || []).map(req => ({
                order_id: `REQ-${req.id.toString().slice(-4)}`,
                id: req.id,
                table_id: req.table_id,
                status: 'PENDING',
                created_at: req.created_at,
                total_amount: req.items.reduce((sum, i) => sum + (i.item_price * i.quantity), 0),
                order_items: req.items.map(ri => ({
                    item_name: ri.item_name,
                    quantity: ri.quantity,
                    price: ri.item_price
                })),
                customer_phone: req.customer_phone,
                isRequest: true
            }));

            filteredOrders = [...pendingRequestsAsOrders, ...filteredOrders];

            const currentUserId = user ? String(user.userId || user.id) : null;
            console.log(`[FRONTEND] Filtered ${fetchedOrders.length} orders + ${pendingRequestsAsOrders.length} requests down to ${filteredOrders.length}`);

            // 9. Enrich Tables with filtered orders data (Uses ALL orders to light up map)
            const enrichedTables = (tablesRes.data || []).map(place => ({
                ...place,
                tables: place.tables.map(t => {
                    const tableOrders = filteredOrders.filter(o => {
                        const match = String(o.table_id) === String(t.tableId);
                        if (String(t.tableId) === '2' || String(t.tableId) === '4') {
                            console.log(`[TABLE SYNC] Table ${t.tableId}: checking order #${o.order_id} table_id=${o.table_id} (${typeof o.table_id}) status=${o.status} -> match=${match}`);
                        }
                        return match && !['PAID', 'CLOSED', 'CANCELLED'].includes(o.status?.toUpperCase());
                    });

                    if (tableOrders.length > 0) {
                        // All waiters can access all tables
                        const isOwnOrder = true;

                        return {
                            ...t,
                            hasActiveOrder: true,
                            isOwnOrder: true,
                            orderStatus: tableOrders.length > 1 ? 'MULTIPLE' : tableOrders[0].status,
                            totalAmount: tableOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
                            orderId: tableOrders.map(o => o.order_id).join(', #'),
                            customerPhone: tableOrders[0].customer_phone || ''
                        };
                    }
                    return {
                        ...t,
                        hasActiveOrder: false,
                        isOwnOrder: true, // If empty, anyone can access it
                        orderStatus: null,
                        totalAmount: 0,
                        orderId: null,
                        customerPhone: ''
                    };
                })
            }));

            // Dashboard queues show all active orders (no waiter-specific filtering)
            const waiterOwnOrders = filteredOrders;

            setOrders(waiterOwnOrders);
            setTables(enrichedTables);
            setMenu(menuRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Data fetch failed', err);
            if (err.response?.status === 401) handleLogout();
        }
    };

    const startSession = async () => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            await axios.post(`${API_BASE_URL}/waiter/session/start`, {
                waiter_name: user?.username || user?.name || 'Waiter',
                waiter_id: user?.userId || user?.id
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Failed to start waiter session', err);
        }
    };

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            await axios.post(`${API_BASE_URL}/waiter/session/end`, {
                waiter_id: user?.userId || user?.id
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Failed to end waiter session', err);
        }
        sessionStorage.removeItem('waiter_token');
        sessionStorage.removeItem('waiter_user');
        setUser(null);
    };

    const hasRealVariantChoices = (item) => {
        if (!item.variants || item.variants.length === 0) return false;
        return item.variants.some(variant => {
            if (variant.type !== "SINGLE") return true;
            if (variant.options.length > 1) return true;
            if (variant.options.length === 1 && variant.options[0].price > 0) return true;
            return false;
        });
    };

    const addToCart = (item) => {
        // Items from VariantModal are already processed and have uniqueKey
        if (item.uniqueKey) {
            setCart(prev => {
                const existing = prev.find(i => i.uniqueKey === item.uniqueKey);
                if (existing) {
                    return prev.map(i => i.uniqueKey === item.uniqueKey ? { ...i, quantity: i.quantity + item.quantity } : i);
                }
                return [...prev, item];
            });
            return;
        }

        // Direct clicks from Menu View
        if (hasRealVariantChoices(item)) {
            setVariantModalItem(item);
        } else {
            // Auto-select single options
            const autoSelectedVariants = item.variants?.map(variant => ({
                variant_id: variant.id,
                variant_name: variant.name,
                option_id: variant.options[0]?.id,
                option_name: variant.options[0]?.name,
                price: parseFloat(variant.options[0]?.price || 0),
                price_delta: parseFloat(variant.options[0]?.price || 0)
            })) || [];

            const totalPrice = parseFloat(item.price) +
                autoSelectedVariants.reduce((sum, v) => sum + v.price, 0);

            const cartItem = {
                id: item.id,
                name: item.name,
                quantity: 1,
                base_price: parseFloat(item.price),
                variants: autoSelectedVariants,
                total_price: totalPrice,
                image: item.image,
                uniqueKey: `${item.id}-${JSON.stringify(autoSelectedVariants.map(v => v.option_id))}`
            };

            setCart(prev => {
                const existing = prev.find(i => i.uniqueKey === cartItem.uniqueKey);
                if (existing) {
                    return prev.map(i => i.uniqueKey === cartItem.uniqueKey ? { ...i, quantity: i.quantity + 1, total_price: i.total_price + cartItem.total_price } : i);
                }
                return [...prev, cartItem];
            });
        }
    };

    const removeFromCart = (uniqueKey) => {
        setCart(prev => prev.filter(i => i.uniqueKey !== uniqueKey));
    };

    const updateCartQty = (uniqueKey, delta) => {
        setCart(prev => prev.map(i => {
            if (i.uniqueKey === uniqueKey) {
                const newQty = Math.max(1, i.quantity + delta);
                const unitPrice = i.total_price / i.quantity;
                return { ...i, quantity: newQty, total_price: unitPrice * newQty };
            }
            return i;
        }));
    };

    const handleItemClick = (item) => {
        if (!selectedTableForOrder) {
            alert("Please select a table first.");
            return;
        }
        addToCart(item);
    };

    const submitOrderRequest = async () => {
        if (!selectedTableForOrder || cart.length === 0) return;
        setIsSubmitting(true);
        try {
            const token = sessionStorage.getItem('waiter_token');
            const payload = {
                table_id: selectedTableForOrder.tableId,
                items: cart.map(i => ({
                    id: i.id || i.menu_item_id,
                    item_name: i.name,
                    item_price: i.total_price / i.quantity,
                    quantity: i.quantity,
                    variants: i.variants ? i.variants.map(v => ({
                        variant_id: v.variant_id,
                        option_id: v.option_id,
                        variant_name: v.variant_name,
                        option_name: v.option_name,
                        price_delta: v.price_delta
                    })) : []
                })),
                waiter_name: user?.username || user?.name || 'Waiter',
                customer_phone: selectedTableForOrder.customerPhone || '',
                notes: ''
            };

            const res = await axios.post(`${API_BASE_URL}/waiter/order-requests`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 201) {
                setCart([]);
                fetchAllData(); // Refresh to show in "Previously Ordered"
            }
        } catch (err) {
            alert('Failed to send request: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestTableAccess = async (tableId) => {
        try {
            const token = sessionStorage.getItem('waiter_token');
            const res = await axios.post(`${API_BASE_URL}/waiter/table-access-requests`,
                { table_id: tableId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (res.status === 201) {
                alert('Request sent to cashier successfully!');
            }
        } catch (err) {
            alert('Failed to send table request: ' + (err.response?.data?.error || err.message));
        }
    };



    if (!user) {
        return (
            <PortalLoginCard
                title="Waiter Portal"
                subtitle="Chill Grand — Floor Service"
                accentColor="#8b5cf6"
                footerLabel="waiter-portal-4421"
                usernameValue={loginUsername}
                passwordValue={loginPassword}
                onUsernameChange={e => setLoginUsername(e.target.value)}
                onPasswordChange={e => setLoginPassword(e.target.value)}
                onSubmit={handleLogin}
                error={loginError}
                loading={loginLoading}
                submitLabel="Sign In to Waiter Portal"
            />
        );
    }


    return (
        <div className="waiter-layout">
            <aside className="waiter-sidebar">
                <div className="sidebar-brand">
                    <img src={logo} alt="Chill Grand" />
                    <h3>CHILL GRAND</h3>
                </div>

                <nav className="sidebar-nav">
                    <button className={activeTab === 'DASHBOARD' ? 'active' : ''} onClick={() => { setActiveTab('DASHBOARD'); setSearchQuery(''); }}>
                        <LayoutDashboard size={22} /> <span>Dashboard</span>
                    </button>
                    <button className={activeTab === 'TABLES' ? 'active' : ''} onClick={() => { setActiveTab('TABLES'); setSearchQuery(''); }}>
                        <Grid2X2 size={22} /> <span>Tables</span>
                    </button>
                    <button className={activeTab === 'ORDERS' ? 'active' : ''} onClick={() => { setActiveTab('ORDERS'); setSearchQuery(''); }}>
                        <ClipboardList size={22} /> <span>Orders</span>
                    </button>
                    <button className={activeTab === 'KITCHEN' ? 'active' : ''} onClick={() => { setActiveTab('KITCHEN'); setSearchQuery(''); }}>
                        <CookingPot size={22} /> <span>Kitchen Status</span>
                    </button>
                    <button className={activeTab === 'MENU' ? 'active' : ''} onClick={() => { setActiveTab('MENU'); setSearchQuery(''); }}>
                        <UtensilsCrossed size={22} /> <span>Menu View</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">{user.username[0].toUpperCase()}</div>
                        <div className="name-role">
                            <span className="username">{user.username}</span>
                            <span className="role">{user.role}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="waiter-content">
                <header className="content-header">
                    <div className="header-title">
                        <h2>
                            {activeTab === 'MENU'
                                ? (selectedTableForOrder ? `Order for Table T-${selectedTableForOrder.tableId}` : 'Menu Explorer')
                                : activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
                        </h2>
                        {selectedTableForOrder && activeTab === 'MENU' ? (
                            <span className="live-badge active-ordering">
                                <span className="dot pulse"></span> ACIVE ORDERING MODE
                            </span>
                        ) : (
                            <span className="live-badge"><span className="dot"></span> Staff Portal</span>
                        )}
                    </div>
                    <div className="header-actions">
                        {selectedTableForOrder && activeTab === 'MENU' && (
                            <button className="clear-table-btn" onClick={() => { setSelectedTableForOrder(null); setCart([]); }}>
                                <XCircle size={14} /> Clear Selection
                            </button>
                        )}
                        <div className="clock-display">
                            <Clock size={16} /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <button className="notif-btn"><Bell size={20} /></button>
                    </div>
                </header>

                <div className="scroll-content">
                    {activeTab === 'DASHBOARD' && <DashboardView orders={orders} onTabChange={setActiveTab} />}
                    {activeTab === 'TABLES' && (
                        <TablesManagementView
                            tables={tables}
                            selectedPlace={selectedPlace}
                            setSelectedPlace={setSelectedPlace}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            showMyTablesOnly={showMyTablesOnly}
                            setShowMyTablesOnly={setShowMyTablesOnly}
                            requestTableAccess={requestTableAccess}
                            user={user}
                            waiterCalls={waiterCalls}
                            billCloseRequests={billCloseRequests}
                            finalBills={finalBills}
                            onTableSelect={(table) => {
                                // 1. If there's a final bill, show preview immediately
                                if (finalBills?.[table.tableId]) {
                                    setPreviewBill(finalBills[table.tableId]);
                                    return;
                                }

                                if (table.hasActiveOrder) {
                                    setSelectedTableForOrder(table);
                                    setActiveTab('MENU');
                                } else {
                                    setPendingTable(table);
                                    setCustomerPhone('');
                                    setShowPhoneModal(true);
                                }
                                setSearchQuery('');
                            }}
                        />
                    )}
                    {activeTab === 'ORDERS' && (
                        <OrdersView
                            orders={orders}
                            onOrderDetail={(order) => setSelectedOrderDetail(order)}
                        />
                    )}
                    {activeTab === 'KITCHEN' && <KitchenStatusView orders={orders} user={user} onMarkServed={markItemAsServed} />}
                    {activeTab === 'MENU' && (
                        <div className={`menu-active-session-layout ${selectedTableForOrder ? 'with-sidebar' : 'full-width'}`}>
                            <MenuView
                                menu={menu}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                handleItemClick={handleItemClick}
                                activeTableId={selectedTableForOrder?.tableId}
                            />
                            {selectedTableForOrder && (
                                <TableSessionSummary
                                    table={selectedTableForOrder}
                                    cart={cart}
                                    onUpdateQty={updateCartQty}
                                    onRemove={removeFromCart}
                                    onSubmit={submitOrderRequest}
                                    isSubmitting={isSubmitting}
                                    existingOrders={orders.filter(o =>
                                        String(o.table_id) === String(selectedTableForOrder.tableId) &&
                                        !['PAID', 'CLOSED', 'CANCELLED'].includes(o.status?.toUpperCase())
                                    )}
                                />
                            )}
                        </div>
                    )}
                    {activeTab === 'BILLING' && <BillingView orders={orders.filter(o => ['SERVED', 'BILL_OPEN'].includes(o.status))} />}
                </div>
            </main>

            {selectedOrderDetail && (
                <OrderDetailModal
                    order={selectedOrderDetail}
                    finalBill={finalBills[selectedOrderDetail.table_id]}
                    onPreviewBill={(bill) => {
                        setPreviewBill(bill);
                        setSelectedOrderDetail(null);
                    }}
                    onClose={() => setSelectedOrderDetail(null)}
                />
            )}

            {showPhoneModal && (
                <CustomerMobileModal
                    onClose={() => setShowPhoneModal(false)}
                    onSubmit={(phone) => {
                        setSelectedTableForOrder({ ...pendingTable, customerPhone: phone });
                        setShowPhoneModal(false);
                        setActiveTab('MENU');
                    }}
                />
            )}

            {previewBill && (
                <FinalBillModal
                    bill={previewBill}
                    onClose={() => setPreviewBill(null)}
                />
            )}

            {/* Served Notifications Portal */}
            <div className="notification-toast-container">
                {servedItemNotifications.map(n => (
                    <div key={n.id} className="served-notification animate-in slide-in-from-top duration-500" style={{ borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <div className="notif-icon"><BellRing className="text-amber-500 animate-pulse" /></div>
                            <div className="notif-body" style={{ flex: 1 }}>
                                <h5 style={{ color: '#f59e0b' }}>Ready To Serve!</h5>
                                <p><strong>{n.itemName}</strong> for <strong>Table T-{n.tableId}</strong> is waiting.</p>
                            </div>
                            <button className="notif-close" onClick={() => removeNotification(n.id)}><X size={16} /></button>
                        </div>
                        <button
                            style={{ marginTop: '0.75rem', alignSelf: 'flex-start', background: '#34d399', color: '#000', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
                            onClick={() => markItemAsServed(n.id, n.orderId, n.itemId)}
                        >
                            Mark Delivered
                        </button>
                    </div>
                ))}

                {/* Waiter Call Notifications */}
                {Object.entries(waiterCalls).map(([tableId, call]) => (
                    call.status === 'PENDING' && (
                        <div key={`call-${tableId}`} className="served-notification call-alert animate-in slide-in-from-top duration-500" style={{ borderLeft: '4px solid #ef4444', display: 'flex', flexDirection: 'column', background: 'rgba(239, 68, 68, 0.15)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}>
                            <div style={{ display: 'flex', width: '100%' }}>
                                <div className="notif-icon"><BellRing className="text-red-500 animate-bounce" /></div>
                                <div className="notif-body" style={{ flex: 1 }}>
                                    <h5 style={{ color: '#ef4444', fontWeight: '800' }}>CUSTOMER CALLING!</h5>
                                    <p><strong>Table T-{tableId}</strong> is requesting assistance.</p>
                                </div>
                            </div>
                            <button
                                style={{
                                    marginTop: '0.75rem',
                                    width: '100%',
                                    background: '#ef4444',
                                    color: '#fff',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => acceptWaiterCall(tableId)}
                            >
                                Accept Call
                            </button>
                        </div>
                    )
                ))}

                {/* Bill Close Requests */}
                {Object.entries(billCloseRequests).map(([tableId, req]) => (
                    req.status === 'PENDING' && (
                        <div key={`bill-${tableId}`} className="served-notification bill-alert animate-in slide-in-from-top duration-500" style={{ borderLeft: '4px solid #f1c40f', display: 'flex', flexDirection: 'column', background: 'rgba(241, 196, 15, 0.15)', boxShadow: '0 0 20px rgba(241, 196, 15, 0.2)' }}>
                            <div style={{ display: 'flex', width: '100%' }}>
                                <div className="notif-icon"><ReceiptText className="text-yellow-500 animate-bounce" /></div>
                                <div className="notif-body" style={{ flex: 1 }}>
                                    <h5 style={{ color: '#f1c40f', fontWeight: '800' }}>BILL CLOSE REQUEST!</h5>
                                    <p><strong>Table T-{tableId}</strong> wants to pay.</p>
                                </div>
                            </div>
                            <button
                                style={{
                                    marginTop: '0.75rem',
                                    width: '100%',
                                    background: '#f1c40f',
                                    color: '#000',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase'
                                }}
                                onClick={() => acceptBillCloseRequest(tableId)}
                            >
                                Accept & Process
                            </button>
                        </div>
                    )
                ))}
            </div>

            {variantModalItem && (
                <VariantModal
                    item={variantModalItem}
                    onClose={() => setVariantModalItem(null)}
                    onAddToCart={(processedItem) => {
                        addToCart(processedItem);
                        setVariantModalItem(null);
                    }}
                />
            )}
        </div>
    );
};

/* --- Sub-Views --- */

const DashboardView = ({ orders, onTabChange }) => {
    const prepOrders = orders.filter(o => ['PLACED', 'PREPARING', 'SERVED'].includes(o.status));

    return (
        <div className="view-container dashboard-main">
            <div className="stats-row">
                <div className="stat-card blue">
                    <div className="stat-icon"><ClipboardList size={22} /></div>
                    <span className="s-label">Active Orders</span>
                    <span className="s-value">{orders.filter(o => ['PLACED', 'PREPARING'].includes(o.status)).length}</span>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle2 size={22} /></div>
                    <span className="s-label">Ready to Serve</span>
                    <span className="s-value">{orders.filter(o => (
                        ((o.kitchen_tracking?.ready_item_ids?.length > 0) || (o.juice_tracking?.ready_item_ids?.length > 0))
                        && o.status !== 'PAID' && o.status !== 'CLOSED'
                    )).length}</span>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><ReceiptText size={22} /></div>
                    <span className="s-label">Closed Orders</span>
                    <span className="s-value">{orders.filter(o => ['CLOSED', 'PAID'].includes(o.status)).length}</span>
                </div>
            </div>

            <div className="recent-activity">
                <div className="section-header-flex">
                    <h3 className="section-title">Preparation Queue</h3>
                    <span className="count-pill">{prepOrders.length} Orders in Progress</span>
                </div>

                <div className="prep-queue-grid">
                    {prepOrders.length === 0 ? (
                        <div className="empty-state-queue">
                            <UtensilsCrossed size={48} />
                            <p>No active preparations at the moment.</p>
                        </div>
                    ) : (
                        prepOrders.map(order => {
                            // Merge kitchen + beverage ready items for the prep queue card
                            const readyIds = [
                                ...(order.kitchen_tracking?.ready_item_ids || []),
                                ...(order.juice_tracking?.ready_item_ids   || [])
                            ];
                            const hasReadyItems = readyIds.length > 0;
                            const isAllServed = order.status === 'SERVED';

                            return (
                                <div
                                    key={order.order_id}
                                    className={`prep-order-card clickable ${hasReadyItems ? 'has-ready-items' : ''}`}
                                    onClick={() => onTabChange('KITCHEN')}
                                >
                                    <div className="prep-card-header">
                                        <div className="table-ref">
                                            <span className="t-label">TABLE</span>
                                            <span className="t-val">{order.table_id || 'T.A'}</span>
                                        </div>
                                        {hasReadyItems ? (
                                            <div className="status-pill ready-blink">
                                                READY TO SERVE
                                            </div>
                                        ) : (
                                            <div className={`status-pill ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </div>
                                        )}
                                    </div>
                                    <div className="prep-card-body">
                                        <div className="order-meta">
                                            <span className="o-num">#{order.order_id}</span>
                                            <div className="o-time"><Clock size={11} /> Placed: {formatTime(order.created_at)}</div>
                                        </div>
                                        <div className="prep-card-timelines">
                                            {(order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at) && (
                                                <span className="waiter-time-chip prep">
                                                    <Flame size={11} /> Prep: {formatTime(order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at)}
                                                </span>
                                            )}
                                            {(order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at || hasReadyItems) && (
                                                <span className="waiter-time-chip ready">
                                                    <CheckCircle2 size={11} /> Ready: {formatTime(order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at || (order.kitchen_tracking?.item_ready_times && Object.values(order.kitchen_tracking.item_ready_times)[0]) || (order.juice_tracking?.item_ready_times && Object.values(order.juice_tracking.item_ready_times)[0]))}
                                                </span>
                                            )}
                                        </div>
                                        <div className="item-count">
                                            <strong>{order.order_items.length}</strong> {order.order_items.length === 1 ? 'Item' : 'Items'} ordered
                                            {hasReadyItems && <div className="ready-alert-small"><BellRing size={10} /> {readyIds.length} item{readyIds.length > 1 ? 's' : ''} ready!</div>}
                                        </div>
                                    </div>
                                    <div className="prep-card-footer">
                                        <span className="total-val">Rs. {parseFloat(order.total_amount).toLocaleString()}</span>
                                        <div className="go-to-kitchen-link">
                                            Go to Kitchen <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

const CallAcceptedBadge = ({ acceptedAt }) => {
    const [timeLeft, setTimeLeft] = React.useState('');
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        const update = () => {
            const start = new Date(acceptedAt);
            const now = new Date();
            const diff = 120 - Math.floor((now - start) / 1000);
            if (diff > 0) {
                const mins = Math.floor(diff / 60);
                const secs = diff % 60;
                setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
            } else {
                setIsVisible(false);
            }
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [acceptedAt]);

    if (!isVisible) return null;

    return (
        <div className="client-call-status">
            <span className="call-msg">Call Accepted</span>
            <div className="call-countdown-badge">
                <Clock size={12} />
                <span>{timeLeft}</span>
            </div>
        </div>
    );
};

const TablesManagementView = ({ tables, selectedPlace, setSelectedPlace, searchQuery, setSearchQuery, onTableSelect, user, showMyTablesOnly, setShowMyTablesOnly, requestTableAccess, waiterCalls, billCloseRequests, finalBills }) => {

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED': return 'status-blue';
            case 'PREPARING': return 'status-orange';
            case 'SERVED': return 'status-green';
            case 'BILL_OPEN': return 'status-purple';
            case 'PENDING': return 'status-yellow';
            default: return 'status-gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED': return <Clock3 size={14} />;
            case 'PREPARING': return <Flame size={14} />;
            case 'SERVED': return <CheckCircle2 size={14} />;
            case 'BILL_OPEN': return <AlertCircle size={14} />;
            case 'PENDING': return <Clock size={14} />;
            default: return null;
        }
    };

    return (
        <div className="view-container tables-management">
            <div className="tables-top-bar">
                <div className="places-breadcrumb">
                    <button
                        className={`breadcrumb-item ${!selectedPlace ? 'active' : ''}`}
                        onClick={() => setSelectedPlace(null)}
                    >
                        All Areas
                    </button>
                    {selectedPlace && (
                        <>
                            <ChevronRight size={16} className="sep" />
                            <span className="breadcrumb-item active">{selectedPlace.placeName}</span>
                        </>
                    )}
                </div>

                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search table #"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

            </div>

            {!selectedPlace ? (
                <div className="places-grid">
                    {tables.map(place => (
                        <div key={place.placeId} className="place-card" onClick={() => setSelectedPlace(place)}>
                            <div className="place-icon"><MapPin size={24} /></div>
                            <div className="place-info">
                                <h3>{place.placeName}</h3>
                                <div className="place-stats">
                                    <span>{place.tables.length} Tables</span>
                                    <span className="dot"></span>
                                    <span className="active-count">{place.tables.filter(t => t.hasActiveOrder).length} Active</span>
                                </div>
                            </div>
                            <ChevronRight size={20} className="arrow" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="tables-grid-view">
                    {selectedPlace.tables
                        .filter(t => !searchQuery || t.tableId.toString().includes(searchQuery))
                        .map(table => {
                            const isAssignedToMe = true;
                            const isAssignedToOther = false;

                            return (
                                <div
                                    key={table.tableId}
                                    className={`tablet-table-card ${table.hasActiveOrder ? 'occupied' : 'available'} assigned-to-me`}
                                    onClick={() => onTableSelect(table)}
                                >
                                    <div className="table-top">
                                        <div className="flex-col">
                                            <span className="table-number">T-{table.tableId}</span>
                                        </div>
                                        <span className="capacity">{table.seats} Seats</span>
                                    </div>
                                    <div className="table-status">
                                        {table.hasActiveOrder ? (
                                            <div className="status-with-call">
                                                <div className={`status-badge ${getStatusColor(table.orderStatus)}`}>
                                                    {getStatusIcon(table.orderStatus)}
                                                    {table.orderStatus}
                                                </div>
                                                {waiterCalls?.[table.tableId]?.status === 'ACCEPTED' && (
                                                    <CallAcceptedBadge acceptedAt={waiterCalls[table.tableId].accepted_at} />
                                                )}
                                                {billCloseRequests?.[table.tableId] && !finalBills?.[table.tableId] && (
                                                    <div className={`bill-status-badge ${billCloseRequests[table.tableId].status.toLowerCase()}`}>
                                                        {billCloseRequests[table.tableId].status === 'PENDING' ? 'Requesting Close Bill' : 'Closing Bill'}
                                                    </div>
                                                )}
                                                {finalBills?.[table.tableId] && (
                                                    <div className="bill-status-badge notified">
                                                        CLOASED BILL
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="status-with-call">
                                                <div className="status-badge available">AVAILABLE</div>
                                                {waiterCalls?.[table.tableId]?.status === 'ACCEPTED' && (
                                                    <CallAcceptedBadge acceptedAt={waiterCalls[table.tableId].accepted_at} />
                                                )}
                                                {billCloseRequests?.[table.tableId] && (
                                                    <div className={`bill-status-badge ${billCloseRequests[table.tableId].status.toLowerCase()}`}>
                                                        {billCloseRequests[table.tableId].status === 'PENDING' ? 'Requesting Close Bill' : 'Closing Bill'}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {table.hasActiveOrder && (
                                        <div className="table-footer" style={{ justifyContent: 'center' }}>
                                            <div className="order-time">#{table.orderId}</div>
                                        </div>
                                    )}
                                    {!table.hasActiveOrder && (
                                        <div className="table-actions-row" style={{ justifyContent: 'center' }}>
                                            <div className="table-action">TAP TO OPEN</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

const MenuView = ({ menu, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, handleItemClick, activeTableId }) => {
    const categories = useMemo(() => {
        if (!Array.isArray(menu)) return [];

        // Group by category since /live returns a flat list
        const groups = {};
        menu.forEach(item => {
            const catName = item.category || 'Other';
            if (!groups[catName]) {
                groups[catName] = { name: catName, items: [] };
            }
            groups[catName].items.push(item);
        });
        return Object.values(groups);
    }, [menu]);

    const filteredItems = useMemo(() => {
        if (!Array.isArray(menu)) return [];
        return menu.filter(item => {
            const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [menu, selectedCategory, searchQuery]);

    return (
        <div className="view-container menu-explorer">
            <div className="menu-top-bar">
                <div className="category-tabs">
                    <button
                        className={`tab-item ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        <ShoppingBasket size={18} /> All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            className={`tab-item ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="search-box dark">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="menu-items-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className={`menu-staff-card ${!item.available ? 'out-of-stock' : ''}`}>
                        <div className="item-header">
                            <span className="item-cat">{item.category}</span>
                            {!item.available && (
                                <span className="stock-label">
                                    <XCircle size={12} /> OUT OF STOCK
                                </span>
                            )}
                        </div>
                        <h4 className="item-name">{item.name}</h4>
                        <div className="item-footer">
                            <div className="item-price">Rs. {parseFloat(item.price).toLocaleString()}</div>
                            <div className="item-action-btns">
                                {item.available ? (
                                    <>
                                        <button
                                            className="add-v-btn"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            ADD TO ORDER
                                        </button>
                                    </>
                                ) : (
                                    <div className="item-action">Unavailable</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="empty-search">
                        <Search size={48} />
                        <p>No items found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const OrdersView = ({ orders, onOrderDetail }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');

    const filteredOrders = useMemo(() => {
        let result = orders.filter(order => {
            if (['CLOSED', 'PAID', 'CANCELLED'].includes(order.status?.toUpperCase())) {
                return false;
            }
            const matchesSearch =
                order.order_id.toString().includes(searchQuery) ||
                (order.table_id && order.table_id.toString().includes(searchQuery)) ||
                (order.order_items.some(i => i.item_name.toLowerCase().includes(searchQuery.toLowerCase())));
            return matchesSearch;
        });

        return result.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });
    }, [orders, searchQuery, sortOrder]);

    return (
        <div className="view-container orders-management">
            <div className="orders-top-controls">
                <div className="search-box-pro">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search Order ID, Table or Items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="order-sort-actions">
                    <button
                        className={`sort-pill-btn ${sortOrder === 'latest' ? 'active' : ''}`}
                        onClick={() => setSortOrder('latest')}
                    >
                        <ArrowUpNarrowWide size={14} /> Latest First
                    </button>
                    <button
                        className={`sort-pill-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                        onClick={() => setSortOrder('oldest')}
                    >
                        <ArrowDownWideNarrow size={14} /> Oldest First
                    </button>
                </div>
            </div>

            <div className="orders-table-container custom-scrollbar">
                <table className="modern-table-pro">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>TABLE</th>
                            <th>ORDERED ITEMS</th>
                            <th>TIME</th>
                            <th className="align-center">STATUS</th>
                            <th className="align-right">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <tr key={order.order_id}>
                                <td><span className="order-id-badge">#{order.order_id}</span></td>
                                <td><span className="table-ref-badge">{order.table_id ? `T-${order.table_id}` : 'T.A'}</span></td>
                                <td className="items-summary-cell">
                                    <div className="items-list-compact">
                                        {order.order_items.map((i, idx) => (
                                            <span key={idx} className="item-token">
                                                {i.quantity}x {i.item_name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="time-col">
                                    <div className="time-display">
                                        <span className="time-row-item"><Clock size={11} /> Placed: {formatTime(order.created_at)}</span>
                                        {(order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at) && (
                                            <span className="time-row-item status-time-tag prep">
                                                Prep: {formatTime(order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at)}
                                            </span>
                                        )}
                                        {(order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at) && (
                                            <span className="time-row-item status-time-tag ready">
                                                Ready: {formatTime(order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at)}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="align-center">
                                    <span className={`status-badge-pro ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="align-right">
                                    <button className="action-detail-btn" onClick={() => onOrderDetail(order)}>
                                        Details <ChevronRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="empty-table-msg">
                                    <div className="no-result">
                                        <Search size={40} />
                                        <p>No orders found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const KitchenStatusView = ({ orders, user, onMarkServed }) => {
    // Only show orders belonging to this waiter that are not yet closed
    const waiterOrders = orders.filter(o =>
        !['PAID', 'CLOSED', 'CANCELLED'].includes(o.status?.toUpperCase())
    );

    return (
        <div className="view-container">
            <div className="kitchen-status-header">
                <h3><CookingPot size={22} /> Kitchen Preparation Queue</h3>
                <p>Tracking all active items</p>
            </div>

            <div className="kitchen-grid">
                {waiterOrders.length === 0 ? (
                    <div className="empty-state">No active kitchen orders.</div>
                ) : (
                    waiterOrders.map(order => {
                        const kt = order.kitchen_tracking || {};
                        const jt = order.juice_tracking || {};
                        const acceptedTime = kt.accepted_at || jt.accepted_at;
                        const readyTime = kt.ready_at || jt.ready_at;

                        return (
                        <div key={order.order_id} className="order-kitchen-card">
                            <div className="order-card-header">
                                <div className="kitchen-card-header-main">
                                    <span className="table-badge">Table T-{order.table_id}</span>
                                    <span className="order-num-tag">#{order.order_id}</span>
                                </div>
                                <div className="kitchen-card-timing-badges">
                                    <span className="time-badge placed">Placed: {formatTime(order.created_at)}</span>
                                    {acceptedTime && (
                                        <span className="time-badge prep">Prep: {formatTime(acceptedTime)}</span>
                                    )}
                                    {readyTime && (
                                        <span className="time-badge ready">Ready: {formatTime(readyTime)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="order-items-stages">
                                {order.order_items.map(item => {
                                    // Merge kitchen_tracking + juice_tracking so beverage items show correct status
                                    const preparingIds = [
                                        ...(order.kitchen_tracking?.preparing_item_ids || []),
                                        ...(order.juice_tracking?.preparing_item_ids   || [])
                                    ];
                                    const readyIds = [
                                        ...(order.kitchen_tracking?.ready_item_ids || []),
                                        ...(order.juice_tracking?.ready_item_ids   || [])
                                    ];
                                    const servedIds = [
                                        ...(order.kitchen_tracking?.served_item_ids || []),
                                        ...(order.juice_tracking?.served_item_ids   || [])
                                    ];
                                    let status = 'PLACED';
                                    if (servedIds.includes(item.order_item_id)) status = 'SERVED';
                                    else if (readyIds.includes(item.order_item_id)) status = 'READY';
                                    else if (preparingIds.includes(item.order_item_id)) status = 'PREPARING';

                                    const isReady = status === 'READY';
                                    const itemPrepTime = kt.item_preparing_times?.[item.order_item_id] || jt.item_preparing_times?.[item.order_item_id] || acceptedTime;
                                    const itemReadyTime = kt.item_ready_times?.[item.order_item_id] || jt.item_ready_times?.[item.order_item_id] || readyTime;
                                    const itemServedTime = kt.item_served_times?.[item.order_item_id] || jt.item_served_times?.[item.order_item_id] || kt.served_at || jt.served_at;

                                    let itemStatusLabel = '';
                                    if (status === 'PREPARING' && itemPrepTime) itemStatusLabel = `Started: ${formatTime(itemPrepTime)}`;
                                    else if (status === 'READY' && itemReadyTime) itemStatusLabel = `Ready: ${formatTime(itemReadyTime)}`;
                                    else if (status === 'SERVED' && itemServedTime) itemStatusLabel = `Served: ${formatTime(itemServedTime)}`;
                                    else if (status === 'PLACED') itemStatusLabel = `Placed: ${formatTime(order.created_at)}`;

                                    return (
                                        <div key={item.order_item_id} className={`item-stage-row ${status.toLowerCase()} ${isReady ? 'ready-blink-row' : ''}`}>
                                            <div className="item-main-content">
                                                <div className="item-info">
                                                    <div className="item-name-wrap">
                                                        <span className="qty">{item.quantity}x</span>
                                                        <span className="name">{item.item_name}</span>
                                                        {itemStatusLabel && <span className="item-stage-time-tag">{itemStatusLabel}</span>}
                                                    </div>
                                                    <div className="stage-badges-horizontal">
                                                        <span className={`mini-stage ${status === 'PLACED' ? 'active placed' : ''}`}>PLACED</span>
                                                        <span className={`mini-stage ${status === 'PREPARING' ? 'active preparing' : ''}`}>PREPARING</span>
                                                        <span className={`mini-stage ${status === 'READY' ? 'active ready' : ''}`}>READY</span>
                                                        <span className={`mini-stage ${status === 'SERVED' ? 'active served' : ''}`}>SERVED</span>
                                                    </div>
                                                </div>

                                                <div className="item-actions">
                                                    {isReady ? (
                                                        <div className="action-ready-container">
                                                            <div className="ready-text-msg">
                                                                <BellRing size={14} /> <span>Ready since {itemReadyTime ? formatTime(itemReadyTime) : 'now'}!</span>
                                                            </div>
                                                            <button
                                                                className="mark-served-btn-large"
                                                                onClick={() => onMarkServed(null, order.order_id, item.order_item_id)}
                                                            >
                                                                <CheckCircle2 size={16} /> CONFIRM SERVED
                                                            </button>
                                                        </div>
                                                    ) : status === 'SERVED' ? (
                                                        <div className="served-marker">
                                                            <CheckCircle2 size={18} /> <span>DELIVERED ({itemServedTime ? formatTime(itemServedTime) : 'done'})</span>
                                                        </div>
                                                    ) : (
                                                        <div className="prep-waiting">
                                                            <Clock3 size={16} className={status === 'PREPARING' ? 'spin-slow' : ''} />
                                                            <span>{status === 'PLACED' ? `WAITING (${formatTime(order.created_at)})` : `COOKING (${itemPrepTime ? formatTime(itemPrepTime) : 'in progress'})`}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const BillingView = ({ orders }) => (
    <div className="view-container">
        <div className="billing-grid">
            {orders.map(order => (
                <div key={order.order_id} className="bill-card">
                    <div className="bill-header">
                        <span className="bill-num">Bill ID: B-{order.order_id}</span>
                        <span className="bill-table">Table {order.table_id}</span>
                    </div>
                    <div className="bill-body">
                        {order.order_items.map(item => (
                            <div key={item.order_item_id} className="bill-item">
                                <span>{item.quantity}x {item.item_name}</span>
                                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="bill-total">
                            <span>Total</span>
                            <span>Rs. {parseFloat(order.total_amount).toLocaleString()}</span>
                        </div>
                    </div>
                    <button className="print-bill-btn">Generate Bill</button>
                </div>
            ))}
            {orders.length === 0 && <div className="empty-state">No tables ready for billing.</div>}
        </div>
    </div>
);

const OrderDetailModal = ({ order, onClose, finalBill, onPreviewBill }) => {
    if (!order) return null;

    // Merge kitchen_tracking + juice_tracking so beverage items show in the order detail modal
    const preparingIds = [
        ...(order.kitchen_tracking?.preparing_item_ids || []),
        ...(order.juice_tracking?.preparing_item_ids   || [])
    ];
    const readyIds = [
        ...(order.kitchen_tracking?.ready_item_ids || []),
        ...(order.juice_tracking?.ready_item_ids   || [])
    ];
    const servedIds = [
        ...(order.kitchen_tracking?.served_item_ids || []),
        ...(order.juice_tracking?.served_item_ids   || [])
    ];
    const isDineIn = !!order.table_id;

    return (
        <div className="order-detail-overlay animate-in fade-in duration-300" onClick={onClose}>
            <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-info">
                        <h3>Order Details</h3>
                        <div className="header-meta-flex">
                            <span className="order-id-badge">ID: #{order.order_id}</span>
                            <span className="order-target">{isDineIn ? `Table T-${order.table_id}` : 'Takeaway Service'}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}><XCircle size={24} /></button>
                </div>

                <div className="modal-content custom-scrollbar">
                    <div className="status-banner-minimal">
                        <div className="status-label-group">
                            <span className="s-label">Overall Status</span>
                            <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                        </div>
                        <div className="status-label-group">
                            <span className="s-label">Placed Time</span>
                            <span className="order-time">{formatTime(order.created_at)}</span>
                        </div>
                        {(order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at) && (
                            <div className="status-label-group">
                                <span className="s-label">Prep Started</span>
                                <span className="order-time" style={{ color: '#f59e0b' }}>
                                    {formatTime(order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at)}
                                </span>
                            </div>
                        )}
                        {(order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at) && (
                            <div className="status-label-group">
                                <span className="s-label">Ready At</span>
                                <span className="order-time" style={{ color: '#10b981' }}>
                                    {formatTime(order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at)}
                                </span>
                            </div>
                        )}
                    </div>

                    {order.customer_phone && (
                        <div className="contact-detail-section">
                            <div className="contact-card">
                                <Search size={14} />
                                <div className="c-info">
                                    <span className="c-label">Customer Contact</span>
                                    <span className="c-val">{order.customer_phone}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="detail-section">
                        <div className="section-header-row">
                            <h4>Ordered Items</h4>
                            <span className="item-count-badge">{order.order_items?.length} items</span>
                        </div>
                        <div className="items-list-professional">
                            {order.order_items.map((item, idx) => {
                                let itemStatus = order.status;
                                if (servedIds.includes(item.order_item_id)) itemStatus = 'SERVED';
                                else if (readyIds.includes(item.order_item_id)) itemStatus = 'READY';
                                else if (preparingIds.includes(item.order_item_id)) itemStatus = 'PREPARING';
                                else if (order.status === 'PLACED') itemStatus = 'PLACED';

                                const itemPrepTime = order.kitchen_tracking?.item_preparing_times?.[item.order_item_id] || order.juice_tracking?.item_preparing_times?.[item.order_item_id] || order.kitchen_tracking?.accepted_at || order.juice_tracking?.accepted_at;
                                const itemReadyTime = order.kitchen_tracking?.item_ready_times?.[item.order_item_id] || order.juice_tracking?.item_ready_times?.[item.order_item_id] || order.kitchen_tracking?.ready_at || order.juice_tracking?.ready_at;
                                const itemServedTime = order.kitchen_tracking?.item_served_times?.[item.order_item_id] || order.juice_tracking?.item_served_times?.[item.order_item_id] || order.kitchen_tracking?.served_at || order.juice_tracking?.served_at;

                                let itemTimeStr = '';
                                if (itemStatus === 'PREPARING' && itemPrepTime) itemTimeStr = formatTime(itemPrepTime);
                                else if (itemStatus === 'READY' && itemReadyTime) itemTimeStr = formatTime(itemReadyTime);
                                else if (itemStatus === 'SERVED' && itemServedTime) itemTimeStr = formatTime(itemServedTime);
                                else if (itemStatus === 'PLACED') itemTimeStr = formatTime(order.created_at);

                                return (
                                    <div key={idx} className="order-item-row-pro">
                                        <div className="item-main-content">
                                            <div className="item-desc">
                                                <div className="item-name-line">
                                                    <span className="qty">{item.quantity}x</span>
                                                    <span className="name">{item.item_name}</span>
                                                </div>
                                                {item.selected_variants?.length > 0 && (
                                                    <div className="variants-pro">
                                                        {item.selected_variants.map((v, i) => (
                                                            <span key={i}>{v.option_name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="item-status-col-pro">
                                                {itemTimeStr && <span className="item-time-stamp-pro">{itemTimeStr}</span>}
                                                <div className={`item-status-tag-pro ${itemStatus.toLowerCase()}`}>
                                                    {itemStatus}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {finalBill && (
                        <div className="final-bill-summary-section animate-in slide-in-from-bottom duration-500">
                            <div className="final-bill-notif-box">
                                <div className="box-header">
                                    <FileText size={18} />
                                    <span>FINAL NOTIFIED BILL</span>
                                    <span className="notif-pill">CUSTOMER VIEWING</span>
                                </div>
                                <div className="box-content">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>Rs. {finalBill.details.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Service Charge ({finalBill.details.serviceChargePct || 10}%)</span>
                                        <span>Rs. {finalBill.details.serviceCharge.toLocaleString()}</span>
                                    </div>
                                    {finalBill.details.extras > 0 && (
                                        <div className="summary-row">
                                            <span>{finalBill.details.extraLabel}</span>
                                            <span>Rs. {finalBill.details.extras.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="summary-row grand-total">
                                        <span>GRAND TOTAL</span>
                                        <span>Rs. {finalBill.details.grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    className="preview-bill-btn"
                                    onClick={() => onPreviewBill(finalBill)}
                                >
                                    <Eye size={16} /> PREVIEW CUSTOMER VIEW
                                </button>
                                <p className="waiter-helper-text">
                                    This breakdown is currently displayed on the customer's device.
                                    Instruct client to pay this amount to the cashier.
                                </p>
                            </div>
                        </div>
                    )}

                    {order.kitchen_tracking?.extra_charges?.length > 0 && (
                        <div className="detail-section">
                            <h4>Service Add-ons</h4>
                            <div className="items-list-professional">
                                {order.kitchen_tracking.extra_charges.map((ec, idx) => (
                                    <div key={idx} className="order-item-row-pro extra">
                                        <span className="name">{ec.title}</span>
                                        <span className="price">Rs. {parseFloat(ec.price).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer-clean">
                    <button className="confirm-btn-pro" onClick={onClose}>Close Detail View</button>
                </div>
            </div>
        </div>
    );
};

const TableSessionSummary = ({ table, existingOrders, cart, onUpdateQty, onRemove, onSubmit, isSubmitting }) => {
    // Flatten all items from all existing orders with item-wise status
    const allExistingItems = existingOrders.flatMap(order => {
        // Merge kitchen_tracking + juice_tracking for the table session sidebar
        const preparingIds = [
            ...(order.kitchen_tracking?.preparing_item_ids || []),
            ...(order.juice_tracking?.preparing_item_ids   || [])
        ];
        const readyIds = [
            ...(order.kitchen_tracking?.ready_item_ids || []),
            ...(order.juice_tracking?.ready_item_ids   || [])
        ];
        const servedIds = [
            ...(order.kitchen_tracking?.served_item_ids || []),
            ...(order.juice_tracking?.served_item_ids   || [])
        ];

        return order.order_items.map(item => {
            let itemStatus = order.status; // fallback
            if (servedIds.includes(item.order_item_id)) itemStatus = 'SERVED';
            else if (readyIds.includes(item.order_item_id)) itemStatus = 'READY';
            else if (preparingIds.includes(item.order_item_id)) itemStatus = 'PREPARING';
            else if (order.status === 'PLACED') itemStatus = 'PLACED';

            return { ...item, itemStatus };
        });
    });

    return (
        <aside className="table-session-sidebar animate-in slide-in-from-right duration-300">
            <div className="session-header">
                <div className="table-info-main">
                    <h3>Table T-{table.tableId}</h3>
                    <div className="table-details-sub">
                        <p>{table.placeName || 'Main Hall'}</p>
                        {table.customerPhone && (
                            <span className="customer-phone-badge">
                                <Search size={10} strokeWidth={3} /> {table.customerPhone}
                            </span>
                        )}
                    </div>
                </div>
                {existingOrders.length > 0 && (
                    <div className={`status-pill ${existingOrders[0].status.toLowerCase()}`}>
                        {existingOrders.length > 1 ? 'MULTIPLE ORDERS' : existingOrders[0].status}
                    </div>
                )}
            </div>

            <div className="session-content custom-scrollbar">
                {/* Kitchen Status Shortcut in Sidebar */}
                <button className="sidebar-kitchen-btn" onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'KITCHEN' }))}>
                    <CookingPot size={16} /> Kitchen Order Status
                </button>
                {/* New Items (Cart) */}
                {cart && cart.length > 0 && (
                    <section className="summary-section new-items">
                        <div className="section-title">
                            <PlusCircle size={14} /> <span>New Items Request</span>
                        </div>
                        <div className="items-list">
                            {cart.map((item) => (
                                <div key={item.uniqueKey} className="item-row new-item animate-in fade-in">
                                    <div className="item-desc">
                                        <span className="name">{item.name}</span>
                                        {item.variants?.length > 0 && (
                                            <div className="v-tags">
                                                {item.variants.map((v, i) => <span key={i}>{v.option_name}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-actions">
                                        <div className="qty-control">
                                            <button onClick={() => onUpdateQty(item.uniqueKey, -1)}><Minus size={12} /></button>
                                            <span className="qty">{item.quantity}</span>
                                            <button onClick={() => onUpdateQty(item.uniqueKey, 1)}><Plus size={12} /></button>
                                        </div>
                                        <button className="remove-btn" onClick={() => onRemove(item.uniqueKey)}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="send-request-btn"
                            disabled={isSubmitting}
                            onClick={onSubmit}
                        >
                            {isSubmitting ? 'SENDING...' : 'SEND REQUEST TO CASHIER'}
                        </button>
                    </section>
                )}

                {/* Clean List of Previously Ordered Items */}
                <section className="summary-section existing-items">
                    <div className="section-title">
                        <History size={14} /> <span>Previously Ordered</span>
                    </div>
                    {allExistingItems.length === 0 && (!cart || cart.length === 0) ? (
                        <div className="empty-session-msg">
                            No items ordered for this session yet.
                        </div>
                    ) : (
                        <div className="items-list">
                            {allExistingItems.map((item, idx) => (
                                <div key={`existing-${idx}`} className="item-row existing transition-all">
                                    <div className="item-main-info">
                                        <div className="item-title-group">
                                            <span className="qty-tag">{item.quantity}x</span>
                                            <span className="item-name">{item.item_name}</span>
                                        </div>
                                        {item.selected_variants?.length > 0 && (
                                            <div className="v-tags mini">
                                                {item.selected_variants.map((v, i) => <span key={i}>{v.option_name}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`status-tag-mini ${item.itemStatus.toLowerCase()}`}>
                                        {item.itemStatus}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </aside>
    );
};

const CustomerMobileModal = ({ onClose, onSubmit }) => {
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(phone);
    };

    return (
        <div className="variant-modal-overlay" onClick={onClose}>
            <div className="variant-modal-card phone-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                <div className="variant-modal-header">
                    <div>
                        <h2>Start Session</h2>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--modal-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            New Dining Request
                        </p>
                    </div>
                    <button onClick={onClose} className="close-modal-btn">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="variant-modal-body" style={{ gap: '1.5rem', padding: '2rem 2.5rem' }}>
                    <div className="variant-group">
                        <label className="variant-requirement">Customer Mobile Number</label>
                        <div className="search-box dark" style={{ width: '100%', margin: '0.5rem 0 0 0', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Search size={18} />
                            <input
                                type="tel"
                                placeholder="07x xxxx xxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                autoFocus
                                required
                                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>
                    <div className="modal-actions" style={{ gridTemplateColumns: '1fr', marginTop: '0.5rem' }}>
                        <button type="submit" className="confirm-add-btn" style={{ padding: '1.25rem' }}>
                            CONFIRM & OPEN TABLE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WaiterDashboard;
