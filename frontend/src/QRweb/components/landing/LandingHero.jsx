import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaArrowRight } from 'react-icons/fa';
import '../../styles/components/landing/LandingHero.css';
import logo from '../../../assets/logo.png';
import barImage from '../../../assets/bar.jpg';
import restaurantImage from '../../../assets/restaurants.jpg';
import dessertImage from '../../../assets/dessert.jpg';

const LandingHero = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
    const btnRef = useRef(null);

    const slides = [
        { image: barImage, title: "Premium Bar", subtitle: "Exquisite Cocktails" },
        { image: restaurantImage, title: "Fine Dining", subtitle: "Culinary Artistry" },
        { image: dessertImage, title: "Sweet Perfection", subtitle: "Divine Desserts" }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20; // Max 20px move
            const y = (clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });

            // Magnetic Button Logic
            if (btnRef.current) {
                const rect = btnRef.current.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;

                const distanceX = clientX - btnX;
                const distanceY = clientY - btnY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance < 100) {
                    setMagneticPos({ x: distanceX * 0.3, y: distanceY * 0.3 });
                } else {
                    setMagneticPos({ x: 0, y: 0 });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [slides.length]);

    return (
        <section className="landing-hero">
            {/* Background Slider */}
            <div className="hero-slides">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            transform: `scale(${index === currentSlide ? 1.05 : 1}) translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
                        }}
                    >
                        <div className="hero-overlay"></div>
                    </div>
                ))}
            </div>

            {/* Interactive Glow */}
            <div
                className="mouse-glow"
                style={{
                    left: `${(mousePos.x / 20 * 50) + 50}%`,
                    top: `${(mousePos.y / 20 * 50) + 50}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            ></div>

            {/* Content Container */}
            <div
                className={`hero-container ${isLoaded ? 'visible' : ''}`}
                style={{
                    transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
                }}
            >
                <div className="hero-brand-area">
                    <img src={logo} alt="Chill Grand" className="hero-logo" />
                    <h1 className="hero-brand-name">
                        <span className="brand-chill" style={{ transform: `translateX(${mousePos.x * 0.2}px)` }}>CHILL</span>
                        <span className="brand-grand" style={{ transform: `translateX(${mousePos.x * -0.2}px)` }}>GRAND</span>
                    </h1>
                </div>

                <div className="hero-text-content">
                    <h2 className="hero-main-title">Experience Excellence</h2>
                    <p className="hero-description">
                        Scan. Order. Enjoy. <br />
                        Discover our premium menu at your fingertips.
                    </p>
                </div>

                <div className="hero-action-area">
                    <button
                        ref={btnRef}
                        className="btn-warehouse hero-cta-btn"
                        onClick={() => navigate('/categories')}
                        style={{
                            transform: `translate(${magneticPos.x}px, ${magneticPos.y}px)`
                        }}
                    >
                        <FaQrcode className="cta-icon" />
                        <span>VIEW CATEGORIES NOW</span>
                        <FaArrowRight className="arrow-icon" />
                    </button>

                    <div className="hero-features">
                        <span>• Premium Quality</span>
                        <span>• Fast Service</span>
                        <span>• Fresh Ingredients</span>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="hero-indicators">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default LandingHero;
