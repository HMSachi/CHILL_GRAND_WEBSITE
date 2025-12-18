import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/PlanEvent.css';
import heroBg from '../../assets/bar.jpg';


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
                    <h1 className="event-hero-title">Plan Your Dream Event</h1>
                    <p className="event-hero-subtitle">From intimate gatherings to grand celebrations, we bring your vision to life.</p>
                    <Link to="/event-inquiry" className="btn-fill-form">
                        Fill The Form
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventHero;
