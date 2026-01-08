import React from 'react';
import { FaMinus, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useOrder } from '../QRPages/OrderContext';
import '../styles/OrderSidebar.css';

const OrderSidebar = ({ isOpen, onClose }) => {
    const { orderItems, updateQuantity, removeFromOrder, getTotalPrice } = useOrder();

    if (!isOpen) return null;

    return (
        <div className={`order-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2>Your Order</h2>
                <button className="close-sidebar" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="order-items-list">
                {orderItems.length === 0 ? (
                    <div className="empty-order">
                        <p>Your order is empty</p>
                    </div>
                ) : (
                    orderItems.map((item) => (
                        <div key={item.id} className="order-sidebar-item">
                            <div className="item-main-info">
                                <div className="item-image-container">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">{item.price}</span>
                                </div>
                            </div>
                            <div className="item-controls">
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, -1)}>
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}>
                                        <FaPlus />
                                    </button>
                                </div>
                                <button className="remove-item" onClick={() => removeFromOrder(item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {orderItems.length > 0 && (
                <div className="sidebar-footer">
                    <div className="total-section">
                        <span>Total</span>
                        <span className="total-amount">Rs. {getTotalPrice()}</span>
                    </div>
                    <button className="checkout-btn">
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderSidebar;
