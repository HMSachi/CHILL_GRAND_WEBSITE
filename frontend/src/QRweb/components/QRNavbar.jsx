import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FaShoppingCart } from 'react-icons/fa';
import { useOrder } from '../QRPages/OrderContext';
import '../styles/QRNavbar.css';

const QRNavbar = () => {
    const location = useLocation();
    const [tableInfo, setTableInfo] = useState({ location: 'Dine-In', number: 'Walk-In' });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tableParam = params.get('table');

        if (tableParam) {
            localStorage.setItem('qr_table_id', tableParam);
            parseAndSetTable(tableParam);
        } else {
            const savedTable = localStorage.getItem('qr_table_id');
            if (savedTable) {
                parseAndSetTable(savedTable);
            }
        }
    }, [location]);

    const { orderItems } = useOrder();

    const parseAndSetTable = (rawStr) => {
        // e.g., "Function Hall-2-1779385148023"
        const parts = rawStr.split('-');
        if (parts.length >= 2) {
            setTableInfo({
                location: decodeURIComponent(parts[0]),
                number: parts[1]
            });
        } else {
            setTableInfo({ location: 'Dine-In', number: decodeURIComponent(rawStr) });
        }
    };

    return (
        <nav className="qr-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#111', borderBottom: '1px solid #333' }}>
            <div className="qr-navbar-container">
                <Link to="/categories" className="qr-logo-link">
                    <img src={logo} alt="Chill Grand Logo" className="qr-logo-img" style={{ height: '50px' }} />
                </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                    className="qr-navbar-cart-btn"
                    onClick={() => {
                        // This assumes the parent page (e.g. CategoriesPage) implements toggle logic
                        // Since CategoriesPage already has a FloatingCart, we'll just trigger that or set a global toggle if needed.
                        // Actually, for simplicity, I'll update CategoriesPage and MenuItemsPage to handle a custom event or use the context.
                        window.dispatchEvent(new CustomEvent('toggleOrderSidebar'));
                    }}
                    style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <FaShoppingCart size={20} />
                    {orderItems.length > 0 && (
                        <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#fbbf24', color: '#000', fontSize: '10px', fontWeight: '900', padding: '2px 6px', borderRadius: '50%', boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}>
                            {orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </button>

                {tableInfo && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', padding: '5px 12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#ffc107', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
                            {tableInfo.location}
                        </span>
                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
                            Table {tableInfo.number}
                        </span>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default QRNavbar;
