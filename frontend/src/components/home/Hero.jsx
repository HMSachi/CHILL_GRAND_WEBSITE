import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Hero.css';
import bar from '../../assets/bar.jpg';
import imgDining from '../../assets/food copy.jpg';
import bar2 from '../../assets/bar2.jpg';

const Hero = () => {
    const images = [bar, bar2, imgDining];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="hero" id="home">
            <div className="hero-watermark">CHILL GRAND</div>
            <div className="hero-overlay"></div>

            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-bg-image ${index === currentImage ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <div className="hero-content">
                <div className="hero-badge fade-up">
                    <span className="badge-line"></span>
                    <span className="badge-text">LUXURY DINING EXPERIENCE</span>
                    <span className="badge-line"></span>
                </div>

                <div className="hero-welcome-text fade-up-delay-1">Welcome to</div>

                <h1 className="hero-main-title fade-up-delay-2">
                    <span className="title-part-1">CHILL</span>
                    <span className="title-part-2">GRAND</span>
                </h1>

                <div className="hero-subtitle-container fade-up-delay-3">
                    <div className="tagline-row">
                        <span className="tagline-dot"></span>
                        <span className="tagline-text">RESTAURANT & PUB</span>
                        <span className="tagline-dot"></span>
                    </div>
                </div>

                <div className="hero-actions fade-up-delay-4">
                    <a href="#booking" className="btn-luxury">
                        <span className="btn-glow"></span>
                        <span className="btn-label">BOOK A TABLE</span>
                    </a>
                </div>
            </div>

            <div className="hero-scroll-warehouse">
                <div className="hero-scroll-indicator">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
