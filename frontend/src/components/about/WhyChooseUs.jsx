import React from 'react';
import '../../styles/pages/About.css';

const WhyChooseUs = () => {
    return (
        <div className="why-choose-us">
            <h2 className="section-title center-title">Why people choose us?</h2>
            <p className="section-description center-desc">
                Established with the vision of redefining restaurant culture, chill grand Restaurant began as a small kitchen with a big dream — serving meals that feel like home but taste like a luxury restaurant. Over the years, we have grown into a trusted brand known for flavor, freshness, and friendly service. Every plate we serve tells a story of craftsmanship and dedication.
            </p>

            <div className="features-grid">
                <div className="feature-item">
                    <div className="feature-icon">🍽️</div>
                    <h3>MENU FOR EVERY TASTE</h3>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🌿</div>
                    <h3>ALWAYS QUALITY Ingradients</h3>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">👨‍🍳</div>
                    <h3>EXPERIENCED Chefs</h3>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
