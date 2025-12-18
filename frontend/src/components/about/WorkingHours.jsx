import React from 'react';
import '../../styles/pages/About.css';
import bgImage from '../../assets/back.jpg'; // Placeholder

const WorkingHours = () => {
    return (
        <div className="working-hours-section" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="working-hours-overlay">
                <div className="working-hours-content">
                    <span className="section-subtitle">RESERVATION</span>
                    <h2 className="section-title">Working Hours</h2>
                    <div className="buttons-group">
                        <button className="btn-book-table">BOOK A TABLE</button>
                        <button className="btn-contact">CONTACT US</button>
                    </div>
                </div>
                <div className="working-hours-card">
                    <h3>Sunday to Monday</h3>
                    <p>11.00 AM - 11.30 PM</p>
                </div>
            </div>
        </div>
    );
};

export default WorkingHours;
