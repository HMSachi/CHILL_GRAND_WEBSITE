import React, { useState, useEffect } from 'react';
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

            <div className="hero-overlay"></div>

            <div className="container hero-content">
                <h1>
                    The Perfect Space to <br /> Enjoy Fantastic Food
                </h1>

                <p className="hero-subtitle">
                    Festive dining at Farthings where we are strong believers in <br />
                    using the very best produce
                </p>

                <div className="hero-buttons">
                    <button className="btn-hero-menu">See Our Menus</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
