import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import BackButton from './components/BackButton';
import { useOrder } from './OrderContext';
import './styles/MyOrdersPage.css';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const { orderItems, updateQuantity, removeFromOrder, getTotalPrice } = useOrder();

    return (
        <div className="my-orders-page">
            <div className="my-orders-header">
                <div className="header-top">
                    <BackButton to="/categories" />
                    <h1 className="page-title">My Orders</h1>
                </div>
            </div>

            <div className="orders-container">
                {orderItems.length > 0 ? (
                    <div className="orders-list">
                        {orderItems.map((item) => (
                            <div key={item.id} className="order-item">
                                <div className="order-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="order-item-details">
                                    <h3 className="order-item-name">{item.name}</h3>
                                    <p className="order-item-price">{item.price}</p>
                                </div>
                                <div className="order-item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)}>
                                            <FaMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromOrder(item.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="order-summary">
                            <div className="total-row">
                                <span>Total Amount</span>
                                <span>Rs. {getTotalPrice()}</span>
                            </div>
                            <button className="place-order-btn">
                                Place Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="empty-orders">
                        <FaShoppingBag size={50} color="#fbbf24" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>You haven't added any items to your order yet.</p>
                        <button className="browse-btn" onClick={() => navigate('/categories')}>
                            Browse Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
