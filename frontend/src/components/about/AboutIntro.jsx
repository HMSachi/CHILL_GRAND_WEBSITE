import React from 'react';
import '../../styles/pages/About.css';
import chefImage from '../../assets/private_dining.jpg'; // Placeholder

const AboutIntro = () => {
    return (
        <div className="about-section about-intro">
            <div className="about-content-left">
                <span className="section-subtitle">ABOUT US</span>
                <h2 className="section-title">We Invite You to Visit Our Chill Grand Resturant</h2>
                <p className="section-description">
                    Chill Grand Restaurant is a modern, high-quality dining destination built on a simple idea – great food starts with passion. Our chefs bring years of experience in creating authentic, freshly cooked meals that blend tradition with creativity. From sourcing the finest ingredients to preparing every dish with precision, we make sure your dining experience is unforgettable.
                </p>
                <button className="btn-read-more">READ MORE</button>
            </div>
            <div className="about-image-right">
                <img src={chefImage} alt="Chef Plating" />
            </div>
        </div>
    );
};

export default AboutIntro;
