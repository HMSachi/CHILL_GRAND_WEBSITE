import { FaFileInvoiceDollar, FaCheckCircle, FaLock, FaTimes } from 'react-icons/fa';
import '../styles/FinalBillModal.css';

const FinalBillModal = ({ bill, onClose }) => {
    if (!bill || bill.status !== 'NOTIFIED') return null;

    const { details } = bill;

    return (
        <div className="final-bill-overlay">
            <div className="final-bill-modal">
                {onClose && (
                    <button className="final-bill-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                )}
                <div className="final-bill-header">
                    <div className="header-icon">
                        <FaFileInvoiceDollar />
                    </div>
                    <h2>Final Bill Presentation</h2>
                    <p className="order-id">Order ID: #{bill.order_id}</p>
                </div>

                <div className="final-bill-content">
                    <div className="bill-section">
                        <h3>Order Summary</h3>
                        <div className="bill-items">
                            {details.items?.map((item, index) => (
                                <div key={index} className="bill-item">
                                    <div className="item-left">
                                        <span className="item-qty">{item.qty}x</span>
                                        <span className="item-name">{item.name}</span>
                                    </div>
                                    <span className="item-price">Rs. {(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bill-divider"></div>

                    <div className="bill-totals">
                        <div className="bill-row">
                            <span>Subtotal</span>
                            <span>Rs. {details.subtotal.toLocaleString()}</span>
                        </div>
                        {details.discountValue > 0 && (
                            <div className="bill-row discount">
                                <span>Discount ({details.discountType})</span>
                                <span>- Rs. {details.discountValue.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="bill-row">
                            <span>Service Charge</span>
                            <span>Rs. {details.serviceCharge.toLocaleString()}</span>
                        </div>
                        {details.extras > 0 && (
                            <div className="bill-row">
                                <span>{details.extraLabel}</span>
                                <span>Rs. {details.extras.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="bill-total-row">
                            <span>Grand Total</span>
                            <span className="grand-total">Rs. {details.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="lock-notice">
                        <FaLock />
                        <div>
                            <p className="notice-title">Ordering Locked</p>
                            <p className="notice-text">Please settle your bill with the cashier. Once paid or released, you can order again.</p>
                        </div>
                    </div>
                </div>

                <div className="final-bill-footer">
                    <div className="status-badge">
                        <FaCheckCircle />
                        <span>Notified by Cashier</span>
                    </div>
                    <p className="footer-note">Waiting for payment confirmation...</p>
                </div>
            </div>
        </div>
    );
};

export default FinalBillModal;
