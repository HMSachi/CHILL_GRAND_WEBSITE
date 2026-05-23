import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { useOrder } from '../QRPages/OrderContext';
import '../styles/FloatingCart.css';

const FloatingCart = ({ onClick }) => {
    const navigate = useNavigate();
    const { orderItems } = useOrder();

    const itemCount = orderItems.reduce((total, item) => total + item.quantity, 0);

    if (itemCount === 0) return null;

    return (
        <div className="floating-cart" onClick={onClick || (() => navigate('/my-orders'))}>
            <div className="cart-content">
                <FaShoppingBag className="cart-icon" />
                <span className="cart-count">{itemCount}</span>
            </div>
            <span className="cart-text">View Order</span>
        </div>
    );
};

export default FloatingCart;
