import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/TableBooking.css';
import heroBg from '../../assets/restaurants.jpg';

const BookingHero = () => {
    return (
        <div className="booking-hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="hero-overlay">
                <div className="container hero-centered-content fade-up">
                    <p className="hero-subtitle">Reserve table using 360° View</p>
                    <h1 className="hero-title">RESERVE YOUR TABLE</h1>
                    <div className="hero-buttons">
                        <a href="#reservation-form" className="btn-book">BOOK A TABLE</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHero;
