import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import FloatingCart from '../components/FloatingCart';
import { useOrder } from './OrderContext';
import { menuItems } from '../dummy/menuItemsData';
import { categories } from '../dummy/categoriesData';
import '../styles/MenuItemsPage.css';

const MenuItemsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { addToOrder } = useOrder();
    const [searchTerm, setSearchTerm] = useState('');
    const [loadedImages, setLoadedImages] = useState({});

    const category = categories.find(c => c.id === parseInt(categoryId));
    const filteredItems = menuItems.filter(item =>
        item.categoryId === parseInt(categoryId) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    const handleAddToOrder = (item) => {
        addToOrder(item);
        navigate('/my-orders');
    };

    if (!category) {
        return (
            <div className="menu-items-error">
                <h2>Category not found</h2>
                <button onClick={() => navigate('/categories')}>Back to Categories</button>
            </div>
        );
    }

    return (
        <div className="menu-items-page">
            <div className="menu-items-header">
                <div className="header-top">
                    <BackButton to="/categories" />
                    <h1 className="category-name">{category.name}</h1>
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
                                    src={item.image}
                                    alt={item.name}
                                    className="item-image"
                                    onLoad={() => handleImageLoad(item.id)}
                                />
                            </div>
                            <div className="item-info">
                                <div className="item-header">
                                    <h3 className="item-name">{item.name}</h3>
                                    <span className="item-price">{item.price}</span>
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
            <FloatingCart />
        </div>
    );
};

export default MenuItemsPage;
