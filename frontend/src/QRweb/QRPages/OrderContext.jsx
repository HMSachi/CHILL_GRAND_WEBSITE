import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState(() => {
        const savedOrder = localStorage.getItem('chill_grand_order');
        return savedOrder ? JSON.parse(savedOrder) : [];
    });

    useEffect(() => {
        localStorage.setItem('chill_grand_order', JSON.stringify(orderItems));
    }, [orderItems]);

    const addToOrder = (item) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromOrder = (itemId) => {
        setOrderItems(prevItems => prevItems.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setOrderItems(prevItems =>
            prevItems.map(i => {
                if (i.id === itemId) {
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

    const getTotalPrice = () => {
        return orderItems.reduce((total, item) => {
            const price = parseInt(item.price.replace('Rs. ', ''));
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
            getTotalPrice
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
