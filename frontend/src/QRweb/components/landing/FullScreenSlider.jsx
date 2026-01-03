import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/components/landing/FullScreenSlider.css';
import logo from '../../../assets/logo.png';
import barImage from '../../../assets/bar.jpg';
import bgImage from '../../../assets/bg.jpg';
import backImage from '../../../assets/back.jpg';
import restaurantImage from '../../../assets/restaurants.jpg';
import dessertImage from '../../../assets/dessert.jpg';

const FullScreenSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [windowOpen, setWindowOpen] = useState(false);

    const slides = [
        {
            image: barImage,
            title: "Premium Bar Experience",
            subtitle: "Exquisite cocktails & finest spirits"
        },
        {
            image: restaurantImage,
            title: "Fine Dining Excellence",
            subtitle: "Culinary artistry at its finest"
        },
        {
            image: dessertImage,
            title: "Divine Desserts",
            subtitle: "Sweet perfection in every bite"
        },
        {
            image: bgImage,
            title: "Elegant Ambiance",
            subtitle: "Where luxury meets comfort"
        },
        {
            image: backImage,
            title: "Unforgettable Moments",
            subtitle: "Creating memories that last"
        }
    ];

    useEffect(() => {
        // Trigger window opening animation
        const windowTimer = setTimeout(() => {
            setWindowOpen(true);
        }, 300);

        // Trigger content load after window opens
        const loadTimer = setTimeout(() => {
            setIsLoaded(true);
        }, 1800);

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => {
            clearTimeout(windowTimer);
            clearTimeout(loadTimer);
            clearInterval(interval);
        };
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="fullscreen-slider">
            {/* Window Opening Animation */}
            <div className={`window-overlay ${windowOpen ? 'open' : ''}`}>
                <div className="window-panel window-left"></div>
                <div className="window-panel window-right"></div>
            </div>

            {/* Logo Overlay */}
            <div className={`logo-overlay ${isLoaded ? 'visible' : ''}`}>
                <img src={logo} alt="Chill Grand" className="slider-logo" />
                <h1 className="slider-brand">
                    <span className="brand-chill">Chill</span>
                    <span className="brand-grand">Grand</span>
                </h1>
            </div>

            {/* Slides */}
            <div className="slides-wrapper">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''} ${index === (currentSlide - 1 + slides.length) % slides.length ? 'prev' : ''
                            }`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slide-overlay"></div>
                        <div className="slide-content">
                            <h2 className="slide-title">{slide.title}</h2>
                            <p className="slide-subtitle">{slide.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <button
                className="nav-btn nav-btn-prev"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <FaChevronLeft />
            </button>
            <button
                className="nav-btn nav-btn-next"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <FaChevronRight />
            </button>

            {/* Indicators */}
            <div className="slide-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-hint">
                <div className="mouse-icon">
                    <div className="wheel"></div>
                </div>
                <p>Scroll to explore</p>
            </div>
        </section>
    );
};

export default FullScreenSlider;
