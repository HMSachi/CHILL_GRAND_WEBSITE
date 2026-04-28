import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/PlanEvent.css';
import heroBg from '../../assets/hero_restaurant_lounge.png';


// This component is likely where the h1 tag would be rendered.
// Since the original document only provided imports and an export,
// and the instruction provided a specific line to change/add,
// I'm placing the h1 tag where it would logically appear within a component's render.
// Given the export default EventHero, I'm assuming this file *is* EventHero.

const EventHero = () => {
    return (
        <div className="event-hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="event-hero-overlay">
                <div className="hero-content">
                    <h1 className="event-hero-title">
                        Celebrate Your
                        <span>Dream Event</span>
                    </h1>
                    <div className="hero-divider"></div>
                    <p className="event-hero-subtitle">We create the perfect experience for your special events. From fun parties to elegant dinners, we make every moment unforgettable.</p>
                    <div className="hero-btns">
                        <Link to="/event-inquiry" className="btn-fill-form">
                            Fill The Form
                        </Link>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span>Explore</span>
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventHero;
