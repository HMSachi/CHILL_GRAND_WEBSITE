import React, { useState } from 'react';
import '../../styles/pages/TableBooking.css';
import { bookingHeroData } from '../../data/bookingData';

const BookingHero = () => {
    return (
        <div className="tb-hero" style={{ backgroundImage: `url(${bookingHeroData.heroBg})` }}>
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
