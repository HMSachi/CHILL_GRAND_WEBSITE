import React from 'react';
import '../../styles/pages/About.css';

const WhyChooseUs = () => {
    return (
        <div className="why-choose-us">
            <span className="section-subtitle center-subtitle">OUR PHILOSOPHY</span>
            <h2 className="section-title center-title">The Art of <span>Exceptional Hospitality</span></h2>
            <p className="section-description center-desc">
                From the careful selection of local ingredients to the precise craft of our mixologists, Chill Grand is dedicated to the finer details of the Restro-Pub experience. Our story is one of innovation, where traditional warmth meets contemporary luxury.
            </p>

            <div className="features-grid">
                <div className="feature-item">
                    <div className="feature-icon">🍽️</div>
                    <h3>GOURMET DINING</h3>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🍸</div>
                    <h3>EXPERT MIXOLOGISTS</h3>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">✨</div>
                    <h3>VIBRANT ATMOSPHERE</h3>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
