import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';

import FloatingCart from '../components/FloatingCart';
import { categories } from '../dummy/categoriesData';
import { menuItems } from '../dummy/menuItemsData';
import { useOrder } from './OrderContext';
import '../styles/CategoriesPage.css';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { addToOrder } = useOrder();
    const [loadedImages, setLoadedImages] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);

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

    const handleCategoryClick = (catId) => {
        navigate(`/menu/${catId}`);
    };

    return (
        <div className="categories-page">


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

                <div className="category-chips">
                    <button
                        className={`chip ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
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
                                            onClick={() => addToOrder(item)}
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
                    <div className="categories-header">
                        <h1 className="categories-title">Our Menu Categories</h1>
                        <p className="categories-subtitle">Explore our wide range of delicious offerings</p>
                    </div>

                    <div className="categories-grid">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="category-card"
                                onClick={() => navigate(`/menu/${category.id}`)}
                            >
                                <div className={`category-image-wrapper ${!loadedImages[category.id] ? 'loading' : 'loaded'}`}>
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="category-image"
                                        loading="lazy"
                                        onLoad={() => handleImageLoad(category.id)}
                                    />
                                    <div className="category-overlay">
                                        <span className="item-count">{category.count} Items</span>
                                    </div>
                                </div>
                                <div className="category-info">
                                    <h3 className="category-name">{category.name}</h3>
                                    <button className="view-items-btn">View Items</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <FloatingCart />
        </div>
    );
};

export default CategoriesPage;
