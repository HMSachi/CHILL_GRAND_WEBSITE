import React from 'react';
import '../../styles/pages/About.css';
import bgImage from '../../assets/back.jpg';

const WorkingHours = () => {
    return (
        <section className="working-hours-section" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="working-hours-overlay">
                <div className="working-hours-container">
                    <div className="working-hours-content">
                        <h2 className="section-title">Working <span>Hours</span></h2>
                        <p className="working-hours-desc">
                            Join us for an unforgettable dining experience. Whether it's a casual lunch or a
                            luxurious dinner, we are ready to serve you with excellence.
                        </p>
                        <div className="buttons-group">
                            <button className="btn-book-table">BOOK A TABLE</button>
                            <button className="btn-contact">CONTACT US</button>
                        </div>
                    </div>
                    <div className="working-hours-glass-card">
                        <div className="card-accent"></div>
                        <h3>Open Daily</h3>
                        <div className="time-display">
                            <span className="days">Sunday to Monday</span>
                            <span className="hours">11:00 AM - 11:30 PM</span>
                        </div>
                        <div className="card-footer">
                            <p>Available for private events and late-night gatherings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkingHours;
