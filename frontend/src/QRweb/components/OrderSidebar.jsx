import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useOrder } from '../QRPages/OrderContext';
import '../styles/OrderSidebar.css';
import { API_BASE_URL } from '../../config/api';

const OrderSidebar = ({ isOpen, onClose }) => {
    const {
        orderItems,
        updateQuantity,
        removeFromOrder,
        getTotalPrice,
        clearOrder,
        customerPhone,
        setCustomerPhone,
        activeOrder,
        assignedWaiter,
        activeCall,
        refreshTableStatus,
        requestWaiter,
        billRequest,
        requestBillClose,
        finalBill
    } = useOrder();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneInput, setPhoneInput] = useState(customerPhone);
    const [showPhonePrompt, setShowPhonePrompt] = useState(!customerPhone);
    const [callCountdown, setCallCountdown] = useState(0);

    useEffect(() => {
        if (activeCall?.status === 'ACCEPTED' && activeCall.accepted_at) {
            const acceptedAt = new Date(activeCall.accepted_at);
            const updateTimer = () => {
                const now = new Date();
                const diffSecs = Math.floor((now - acceptedAt) / 1000);
                const remaining = 120 - diffSecs; // 2 minutes
                if (remaining > 0) {
                    setCallCountdown(remaining);
                } else {
                    setCallCountdown(0);
                }
            };
            updateTimer();
            const timer = setInterval(updateTimer, 1000);
            return () => clearInterval(timer);
        } else {
            setCallCountdown(0);
        }
    }, [activeCall]);

    useEffect(() => {
        setPhoneInput(customerPhone);
        if (customerPhone) setShowPhonePrompt(false);
    }, [customerPhone]);

    const handleSavePhone = () => {
        if (phoneInput.length >= 10) {
            setCustomerPhone(phoneInput);
            setShowPhonePrompt(false);
        } else {
            alert('Please enter a valid phone number');
        }
    };

    const handleCheckout = async () => {
        if (!customerPhone) {
            setShowPhonePrompt(true);
            return;
        }

        const rawTableId = localStorage.getItem('qr_table_id');
        if (!rawTableId) {
            alert('Table ID not found. Please scan the QR code on your table again.');
            return;
        }

        const parts = rawTableId.split('-');
        const tableId = parts.length >= 2 ? parts[1] : rawTableId;

        const payload = {
            table_id: parseInt(tableId, 10),
            customer_phone: customerPhone,
            items: orderItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.unitPrice !== undefined ? item.unitPrice : item.price,
                quantity: item.quantity,
                variants: item.selectedVariants || []
            }))
        };

        try {
            setIsSubmitting(true);
            const response = await fetch(`${API_BASE_URL}/menu/live/order-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Order placed successfully! The kitchen is receiving your request.');
                clearOrder();
                refreshTableStatus(); // Get the new status immediately
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Network error. Please make sure you are connected and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED': return { background: '#3498db20', color: '#3498db', border: '1px solid #3498db40' };
            case 'PREPARING': return { background: '#f39c1220', color: '#f39c12', border: '1px solid #f39c1240' };
            case 'SERVED': return { background: '#2ecc7120', color: '#2ecc71', border: '1px solid #2ecc7140' };
            case 'BILL_OPEN': return { background: '#e74c3c20', color: '#e74c3c', border: '1px solid #e74c3c40' };
            default: return { background: '#88820', color: '#888', border: '1px solid #88840' };
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`order-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div>
                    <h2 className="text-xl font-semibold text-white tracking-tight leading-none uppercase">Active Orders</h2>
                    <div className="flex items-center gap-3 mt-2">
                        {assignedWaiter && (
                            <div className="waiter-badge">
                                <span className="dot"></span>
                                Waiter: {assignedWaiter}
                            </div>
                        )}
                        <button
                            className={`call-waiter-btn ${activeCall?.status === 'PENDING' ? 'ringing' : ''}`}
                            onClick={requestWaiter}
                            disabled={activeCall?.status === 'PENDING' || callCountdown > 0}
                        >
                            {activeCall?.status === 'PENDING' ? (
                                <><span className="ring-pulse"></span> Ringing...</>
                            ) : callCountdown > 0 ? (
                                `Waiter Coming (${Math.floor(callCountdown / 60)}:${(callCountdown % 60).toString().padStart(2, '0')})`
                            ) : (
                                'Call Waiter'
                            )}
                        </button>
                    </div>
                </div>
                <button className="close-sidebar" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="order-items-list custom-scrollbar">
                {/* 1. Show Phone Prompt if missing */}
                {showPhonePrompt ? (
                    <div className="phone-prompt-card">
                        <h3>Customer Identification</h3>
                        <p>Please enter your phone number to start ordering.</p>
                        <input
                            type="tel"
                            placeholder="07x xxxxxxx"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                        />
                        <button onClick={handleSavePhone}>Confirm & Start</button>
                    </div>
                ) : (
                    <div className="customer-badge">
                        <span className="label">ORDERING AS</span>
                        <span className="phone">{customerPhone}</span>
                        <button onClick={() => setShowPhonePrompt(true)} className="edit-btn">Edit</button>
                    </div>
                )}

                {/* 2. Show Active/Placed Orders (From Server) */}
                {activeOrder && (
                    <div className="active-order-section">
                        <div className="order-group-header">
                            <span className="order-id">Order ID: #{activeOrder.order_id}</span>
                            <span className="order-status-badge" style={getStatusStyle(activeOrder.status)}>
                                {activeOrder.status}
                            </span>
                        </div>

                        <div className="active-items">
                            {activeOrder.order_items?.map((item) => (
                                <div key={item.order_item_id} className="active-item-row">
                                    <div className="item-qty">{item.quantity}x</div>
                                    <div className="item-name-group">
                                        <div className="item-name">{item.item_name}</div>
                                        {item.selected_variants?.map((v, i) => (
                                            <span key={i} className="variant-tag">{v.variant_name}: {v.option_name}</span>
                                        ))}
                                    </div>
                                    <div className="item-price">Rs. {item.subtotal}</div>
                                </div>
                            ))}
                        </div>
                        <div className="active-total">
                            <span>Order Total</span>
                            <span>Rs. {activeOrder.total_amount}</span>
                        </div>

                        {/* Bill Close Request Button */}
                        <div className="bill-close-action">
                            {billRequest?.status === 'PENDING' ? (
                                <button className="bill-request-btn ringing" disabled>
                                    <span className="ring-pulse"></span> Requesting to Close Bill...
                                </button>
                            ) : billRequest?.status === 'ACCEPTED' ? (
                                <div className="bill-request-accepted-msg">
                                    <span className="check-icon">✓</span> Request accepted! Cashier will update your bill soon.
                                </div>
                            ) : (
                                <button
                                    className="bill-request-btn"
                                    onClick={() => {
                                        if (window.confirm('Do you want to request the final bill? You won\'t be able to add more items after this.')) {
                                            requestBillClose();
                                        }
                                    }}
                                >
                                    Request to Close Bill
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Show New Items (In Cart) */}
                <div className="new-items-section">
                    <h3 className="section-subtitle">
                        {orderItems.length > 0 ? 'New Items to Add' : (activeOrder ? '' : 'No items yet')}
                    </h3>
                    {orderItems.map((item) => (
                        <div key={item.cartId || item.id} className="order-sidebar-item">
                            <div className="item-main-info">
                                <div className="item-image-container">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    {item.selectedVariants?.map((v, i) => (
                                        <span key={i} className="variant-tag">{v.variant_name}: {v.option_name}</span>
                                    ))}
                                    <span className="item-price">Rs. {item.unitPrice || item.price}</span>
                                </div>
                            </div>
                            <div className="item-controls">
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.cartId || item.id, -1)}>
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.cartId || item.id, 1)}>
                                        <FaPlus />
                                    </button>
                                </div>
                                <button className="remove-item" onClick={() => removeFromOrder(item.cartId || item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {orderItems.length > 0 && (
                <div className="sidebar-footer">
                    <div className="total-section">
                        <span>New Total</span>
                        <span className="total-amount">Rs. {getTotalPrice()}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={isSubmitting || showPhonePrompt || billRequest?.status === 'PENDING' || billRequest?.status === 'ACCEPTED' || finalBill}
                        style={{ opacity: (isSubmitting || showPhonePrompt || billRequest || finalBill) ? 0.7 : 1 }}
                    >
                        {isSubmitting ? 'Sending Request...' :
                            (billRequest?.status === 'PENDING' || billRequest?.status === 'ACCEPTED' || finalBill) ? 'Ordering Locked (Processing Bill)' :
                                (activeOrder ? 'Add to Current Order' : 'Place Primary Order')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderSidebar;
