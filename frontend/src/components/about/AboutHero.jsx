import React from 'react';
import '../../styles/pages/About.css';
import heroBg from '../../assets/bar.jpg';

const AboutHero = () => {
    return (
        <div className="about-hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="about-hero-overlay">
                <div className="hero-watermark">CHILL GRAND</div>
                <div className="about-hero-content">
                    <span className="hero-eyebrow">SINCE 2025 — THE LEGACY</span>
                    <h1 className="hero-main-title">
                        A WORLD OF <br />
                        <span className="accent-text">GOURMET EXCELLENCE</span> <br />
                        & VIBRANT SPIRITS
                    </h1>
                    <p className="hero-description">
                        Chill Grand is where the fusion of culinary mastery and a high-energy bar atmosphere comes to life. We believe that every meal should be an event, and every drink a celebration.
                    </p>
                </div>
                <div className="scroll-indicator">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutHero;
