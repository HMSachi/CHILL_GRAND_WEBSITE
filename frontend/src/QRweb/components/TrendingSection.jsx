import React from 'react';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../dummy/menuItemsData';
import '../styles/TrendingSection.css';

const TrendingSection = () => {
    const navigate = useNavigate();
    const trendingItems = menuItems.filter(item => item.trending);

    return (
        <div className="trending-section">
            <h2 className="trending-title">Trending Now</h2>
            <div className="trending-scroll-container">
                {trendingItems.map((item) => (
                    <div
                        key={item.id}
                        className="trending-card"
                        onClick={() => navigate(`/menu/${item.categoryId}`)}
                    >
                        <div className="trending-image-wrapper">
                            <img src={item.image} alt={item.name} className="trending-image" />
                            <div className="trending-badge">Trending</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingSection;
