import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';

import FloatingCart from '../components/FloatingCart';
import OrderSidebar from '../components/OrderSidebar';
import { useOrder } from './OrderContext';
import QRFooter from '../components/QRFooter';
import '../styles/CategoriesPage.css';
import chickenImg from '../../assets/chicken.jpeg';
import juiceImg from '../../assets/juice.jpeg';
import friedriceImg from '../../assets/friedrice.jpeg';
import noodlesImg from '../../assets/noodles.jpeg';
import seafoodImg from '../../assets/seafood.jpeg';
import specialImg from '../../assets/special.jpeg';
import VariantModal from '../components/VariantModal';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { addToOrder } = useOrder();
    const [loadedImages, setLoadedImages] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [customizingItem, setCustomizingItem] = useState(null);

    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        // Fetch categories
        fetch(`${API_BASE_URL}/menu/categories`)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                // Assign images based on category name
                const withImages = dataArray.map(cat => {
                    let image;
                    switch (cat.name?.toUpperCase()) {
                        case 'CHICKEN': image = chickenImg; break;
                        case 'FRESH JUICE': image = juiceImg; break;
                        case 'FRIED RICE': image = friedriceImg; break;
                        case 'NOODLES': image = noodlesImg; break;
                        case 'SEAFOOD': image = seafoodImg; break;
                        case 'SPECIAL': image = specialImg; break;
                        default: image = undefined;
                    }
                    return { ...cat, image };
                });
                setCategories(withImages);
                if (withImages.length > 0) {
                    setSelectedCategory(withImages[0].id);
                }
            })
            .catch(err => console.error('Error fetching categories:', err));

        // Fetch live menu for search and display
        fetch(`${API_BASE_URL}/menu/live`)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                setMenuItems(dataArray);
            })
            .catch(err => console.error('Error fetching live menu:', err));
    }, []);

    useEffect(() => {
        const handleToggle = () => setIsSidebarOpen(prev => !prev);
        window.addEventListener('toggleOrderSidebar', handleToggle);
        return () => window.removeEventListener('toggleOrderSidebar', handleToggle);
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredItems([]);
        } else {
            const results = menuItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredItems(results);
        }
    }, [searchTerm, menuItems]);

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    const handleAddToOrder = (item) => {
        if (item.variants && item.variants.length > 0) {
            setCustomizingItem(item);
        } else {
            addToOrder({
                ...item,
                unitPrice: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price,
                selectedVariants: []
            });
            setIsSidebarOpen(true);
        }
    };

    const handleConfirmCustomization = (customizedItem) => {
        addToOrder(customizedItem);
        setCustomizingItem(null);
        setIsSidebarOpen(true);
    };

    const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name;

    const categoryItems = selectedCategoryName
        ? menuItems.filter(item => item.category === selectedCategoryName)
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
                                        src={category.image || 'https://placehold.co/100x100?text=Category'}
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
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!isSidebarOpen && !customizingItem && <FloatingCart onClick={() => setIsSidebarOpen(true)} />}
            <OrderSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <QRFooter />

            {customizingItem && (
                <VariantModal
                    item={customizingItem}
                    onClose={() => setCustomizingItem(null)}
                    onAddToCart={handleConfirmCustomization}
                />
            )}
        </div>
    );
};

export default CategoriesPage;
