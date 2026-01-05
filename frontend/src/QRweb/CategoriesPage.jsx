import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './components/BackButton';
import TrendingSection from './components/TrendingSection';
import { categories } from './dummy/categoriesData';
import './styles/CategoriesPage.css';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    return (
        <div className="categories-page">
            <TrendingSection />
            <div className="categories-header">
                <div className="header-top">
                    <h1 className="categories-title">Our Menu Categories</h1>
                </div>
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
        </div>
    );
};

export default CategoriesPage;
