import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Hero.css';
import bar from '../../assets/bar.jpg';
import bar2 from '../../assets/bar2.jpg';
import imgDining from '../../assets/private_dining.jpg';

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
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-bg-image ${index === currentImage ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <div className="container hero-content-warehouse">
                <div className="hero-welcome fade-up">Welcome to</div>
                <h1 className="hero-title fade-up-delay-1">CHILL GRAND</h1>
                <div className="hero-tagline fade-up-delay-2">RESTAURANT & PUB</div>

                <div className="hero-buttons-warehouse fade-up-delay-3">
                    <a href="#menu" className="btn-warehouse">EXPLORE MENU</a>
                    <a href="#booking" className="btn-warehouse outline">BOOK A TABLE</a>
                </div>
            </div>

            <div className="hero-scroll-warehouse">
                <div className="scroll-arrow">
                    <span></span>
                    <span></span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
