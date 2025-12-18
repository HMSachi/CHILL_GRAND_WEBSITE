import React from 'react';
import '../../styles/pages/TableBooking.css';
import heroBg from '../../assets/restaurants.jpg';

const BookingHero = () => {
    return (
        <div className="booking-hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="hero-overlay">
                <p className="hero-subtitle">Reserve table using 360° View</p>
                <h1 className="hero-title">RESERVE YOUR TABLE</h1>
                <div className="hero-buttons">
                    <button className="btn-book">BOOK A TABLE</button>
                    <button className="btn-menu">OPEN MENU</button>
                </div>
            </div>
        </div>
    );
};

export default BookingHero;
