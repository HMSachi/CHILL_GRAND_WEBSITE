import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';


const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState(() => {
        const savedOrder = localStorage.getItem('chill_grand_order');
        return savedOrder ? JSON.parse(savedOrder) : [];
    });

    const [customerPhone, setCustomerPhone] = useState(() => {
        return localStorage.getItem('qr_customer_phone') || '';
    });

    const [activeOrder, setActiveOrder] = useState(null);
    const [assignedWaiter, setAssignedWaiter] = useState(null);
    const [activeCall, setActiveCall] = useState(null);
    const [billRequest, setBillRequest] = useState(null);
    const [finalBill, setFinalBill] = useState(null);

    useEffect(() => {
        localStorage.setItem('chill_grand_order', JSON.stringify(orderItems));
    }, [orderItems]);

    useEffect(() => {
        if (customerPhone) {
            localStorage.setItem('qr_customer_phone', customerPhone);
        }
    }, [customerPhone]);

    const refreshTableStatus = async () => {
        const rawTableId = localStorage.getItem('qr_table_id');
        if (!rawTableId) return;

        const parts = rawTableId.split('-');
        const tableId = parts.length >= 2 ? parts[1] : rawTableId;

        try {
            const response = await fetch(`${API_BASE_URL}/menu/live/table-order/${tableId}`);
            if (response.ok) {
                const data = await response.json();
                setActiveOrder(data.activeOrder);
                setAssignedWaiter(data.assignedWaiter);
                setActiveCall(data.activeCall);
                setBillRequest(data.billRequest);
                setFinalBill(data.finalBill);
            }
        } catch (err) {
            console.error('Failed to fetch table status:', err);
        }
    };

    useEffect(() => {
        refreshTableStatus();
        const interval = setInterval(refreshTableStatus, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, []);

    const addToOrder = (item) => {
        setOrderItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(i =>
                i.id === item.id &&
                JSON.stringify(i.selectedVariants || []) === JSON.stringify(item.selectedVariants || [])
            );

            const addedQty = item.quantity || 1;

            if (existingItemIndex >= 0) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += addedQty;
                return newItems;
            }

            const cartId = item.id + '-' + Math.random().toString(36).substr(2, 9);
            return [...prevItems, { ...item, quantity: addedQty, cartId }];
        });
    };

    const removeFromOrder = (targetId) => {
        setOrderItems(prevItems => prevItems.filter(i => (i.cartId || i.id) !== targetId));
    };

    const updateQuantity = (targetId, delta) => {
        setOrderItems(prevItems =>
            prevItems.map(i => {
                if ((i.cartId || i.id) === targetId) {
                    const newQuantity = Math.max(1, i.quantity + delta);
                    return { ...i, quantity: newQuantity };
                }
                return i;
            })
        );
    };

    const clearOrder = () => {
        setOrderItems([]);
    };

    const requestWaiter = async () => {
        const rawTableId = localStorage.getItem('qr_table_id');
        if (!rawTableId) return;

        const parts = rawTableId.split('-');
        const tableId = parts.length >= 2 ? parts[1] : rawTableId;

        try {
            const response = await fetch(`${API_BASE_URL}/menu/live/call-waiter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table_id: tableId.toString() })
            });

            if (response.ok) {
                const data = await response.json();
                setActiveCall(data.call);
                return true;
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to call waiter');
                return false;
            }
        } catch (err) {
            console.error('Call waiter failed:', err);
            return false;
        }
    };

    const requestBillClose = async () => {
        const rawTableId = localStorage.getItem('qr_table_id');
        if (!rawTableId) return;

        const parts = rawTableId.split('-');
        const tableId = parts.length >= 2 ? parts[1] : rawTableId;

        try {
            const response = await fetch(`${API_BASE_URL}/menu/live/request-bill-close`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table_id: tableId.toString() })
            });

            if (response.ok) {
                const data = await response.json();
                setBillRequest(data.request);
                return true;
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to request bill close');
                return false;
            }
        } catch (err) {
            console.error('Request bill close failed:', err);
            return false;
        }
    };

    const getTotalPrice = () => {
        return orderItems.reduce((total, item) => {
            let price = item.unitPrice !== undefined ? item.unitPrice : item.price;
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
            }
            return total + (price * item.quantity);
        }, 0);
    };

    return (
        <OrderContext.Provider value={{
            orderItems,
            addToOrder,
            removeFromOrder,
            updateQuantity,
            clearOrder,
            getTotalPrice,
            customerPhone,
            setCustomerPhone,
            activeOrder,
            assignedWaiter,
            activeCall,
            billRequest,
            refreshTableStatus,
            requestWaiter,
            requestBillClose,
            finalBill
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
