import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';

import FloatingCart from '../components/FloatingCart';
import OrderSidebar from '../components/OrderSidebar';
import { categories } from '../dummy/categoriesData';
import { menuItems } from '../dummy/menuItemsData';
import { useOrder } from './OrderContext';
import QRFooter from '../components/QRFooter';
import '../styles/CategoriesPage.css';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { addToOrder } = useOrder();
    const [loadedImages, setLoadedImages] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredItems([]);
        } else {
            const results = menuItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredItems(results);
        }
    }, [searchTerm]);

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    const handleAddToOrder = (item) => {
        addToOrder(item);
        setIsSidebarOpen(true);
    };

    const categoryItems = selectedCategory
        ? menuItems.filter(item => item.categoryId === selectedCategory)
        : [];

    return (
        <div className={`categories-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="smart-menu-controls">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for your favorite food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="smart-search-input"
                    />
                </div>
            </div>

            {searchTerm.trim() !== '' ? (
                <div className="search-results">
                    <h2 className="section-title">Search Results</h2>
                    <div className="items-grid">
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
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
                            <p className="no-results">No items found matching "{searchTerm}"</p>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <div className={`category-image-wrapper ${!loadedImages[category.id] ? 'loading' : 'loaded'}`}>
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="category-image"
                                        loading="lazy"
                                        onLoad={() => handleImageLoad(category.id)}
                                    />
                                </div>
                                <h3 className="category-name">{category.name}</h3>
                            </div>
                        ))}
                    </div>

                    {selectedCategory && (
                        <div className="category-items-section">
                            <h2 className="section-title">
                                {categories.find(c => c.id === selectedCategory)?.name}
                            </h2>
                            <div className="items-grid">
                                {categoryItems.map(item => (
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
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!isSidebarOpen && <FloatingCart onClick={() => setIsSidebarOpen(true)} />}
            <OrderSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <QRFooter />
        </div>
    );
};

export default CategoriesPage;
