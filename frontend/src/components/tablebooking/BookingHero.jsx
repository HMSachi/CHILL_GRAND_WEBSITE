import React from 'react';
import '../../styles/pages/TableBooking.css';
import heroBg from '../../assets/luxury_dining_hero.jpg';

const BookingHero = () => {
    return (
        <section className="tb-hero-section">
            {/* Top Cinematic Hero Banner */}
            <div className="tb-hero-banner" style={{ backgroundImage: `url(${heroBg})` }}>
                <div className="tb-hero-overlay">
                    <div className="tb-hero-content">
                        <h1 className="tb-hero-title">
                            Reserve your table <em>in seconds</em>
                        </h1>
                        <a href="#reservation-form" className="btn-hero-gold">
                            Book Table
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingHero;
