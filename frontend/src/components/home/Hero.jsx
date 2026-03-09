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

            <div className="hero-overlay"></div>

            <div className="container hero-content">
                <h1>
                    Your Premium <span>Restaurant & <br /> Vibrant Pub</span> Destination
                </h1>

                <p className="hero-subtitle">
                    Experience the perfect fusion of gourmet dining and a lively bar atmosphere. <br />
                    Where great food meets even better vibes at Chill Grand.
                </p>

                <div className="hero-buttons">
                    <a href="#menu" className="btn-hero-menu">Explore Menu</a>
                    <Link to="/table-booking" className="btn-hero-secondary">Book Your Table</Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
