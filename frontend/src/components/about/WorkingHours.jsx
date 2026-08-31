import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/About.css';
import { workingHoursData } from '../../data/aboutData';

const WorkingHours = () => {
    const navigate = useNavigate();

    return (
        <section className="wh-modern-section" style={{ backgroundImage: `url(${workingHoursData.bgImage})` }}>
            <div className="wh-modern-overlay">
                <div className="wh-modern-container">
                    
                    <div className="wh-modern-content glass-effect">
                        <span className="wh-modern-eyebrow">Plan Your Visit</span>
                        <h2 className="wh-modern-title">Working <span>Hours</span></h2>
                        
                        <p className="wh-modern-desc">
                            Join us for an unforgettable dining experience. Whether it's a casual lunch or a luxurious dinner, we are ready to serve you with excellence.
                        </p>

                        <div className="wh-modern-schedule">
                            <div className="wh-schedule-item">
                                <h4>Monday - Sunday</h4>
                                <p>11:00 AM to midnight</p>
                            </div>
                        </div>

                        <div className="wh-modern-footer">
                            <p>Available for private events and late-night gatherings.</p>
                        </div>

                        <div className="wh-modern-actions">
                            <button className="btn-book-modern" onClick={() => navigate('/table-booking')}>Book a Table</button>
                            <button className="btn-contact-modern" onClick={() => navigate('/contact')}>Contact Us</button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WorkingHours;
