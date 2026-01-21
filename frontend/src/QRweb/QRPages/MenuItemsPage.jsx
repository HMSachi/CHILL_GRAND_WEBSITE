import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import FloatingCart from '../components/FloatingCart';
import OrderSidebar from '../components/OrderSidebar';
import { useOrder } from './OrderContext';
import QRFooter from '../components/QRFooter';
import '../styles/MenuItemsPage.css';

const MenuItemsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { addToOrder } = useOrder();
    const [searchTerm, setSearchTerm] = useState('');
    const [loadedImages, setLoadedImages] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [categoryName, setCategoryName] = useState('Menu');

    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        // 1. Fetch Categories to find the name for this ID
        fetch(`${API_BASE_URL}/menu/categories`)
            .then(res => res.json())
            .then(categories => {
                const currentCategory = categories.find(c => c.id === categoryId); // UUID match
                if (currentCategory) {
                    setCategoryName(currentCategory.name);
                }
            })
            .catch(err => console.error('Error fetching categories:', err));

        // 2. Fetch ALL live menu items (Backend returns all)
        fetch(`${API_BASE_URL}/menu/live`)
            .then(res => res.json())
            .then(data => {
                setItems(data);
            })
            .catch(err => console.error('Error fetching menu items:', err));
    }, [categoryId]);

    // 3. Filter client-side by Category Name
    const filteredItems = items.filter(item =>
        item.category === categoryName &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    const handleAddToOrder = (item) => {
        addToOrder(item);
        setIsSidebarOpen(true);
    };

    return (
        <div className={`menu-items-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="menu-items-header">
                <div className="header-top">
                    <BackButton to="/categories" />
                    <h1 className="category-name">{categoryName}</h1>
                </div>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="items-grid">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="menu-item-card">
                            <div className={`item-image-wrapper ${loadedImages[item.id] ? 'loaded' : 'loading'}`}>
                                <img
                                    src={item.image || 'https://placehold.co/300x200?text=No+Image'}
                                    alt={item.name}
                                    className="item-image"
                                    onLoad={() => handleImageLoad(item.id)}
                                />
                            </div>
                            <div className="item-info">
                                <div className="item-header">
                                    <h3 className="item-name">{item.name}</h3>
                                    <span className="item-price">Rs. {item.price}</span>
                                </div>
                                <p className="item-description">{item.description}</p>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToOrder(item)}
                                >
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-items">
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>
            {!isSidebarOpen && <FloatingCart onClick={() => setIsSidebarOpen(true)} />}
            <OrderSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <QRFooter />
        </div>
    );
};

export default MenuItemsPage;
