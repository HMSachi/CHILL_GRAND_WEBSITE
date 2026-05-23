import React from 'react';
import '../../styles/components/ReserveTable.css';

const ReserveTable = () => {
    return (
        <section className="reserve-table" id="booking">
            <div className="container reserve-container-split">
                <div className="reserve-info-col fade-up">
                    <div className="section-header-warehouse left-align">
                        <div className="header-accent">Reservations</div>
                        <h2 className="header-title">EXPERIENCE<br />CHILL GRAND</h2>
                        <div className="title-underline"></div>
                    </div>
                    <p className="reserve-description">
                        Indulge in a world-class dining experience at Chill Grand. Whether it's a romantic evening,
                        a corporate gathering, or a family celebration, we provide the perfect ambiance and
                        exquisite flavors to make your moments unforgettable.
                    </p>
                    <div className="reserve-features">
                        <div className="res-feature">
                            <div className="feature-icon">✨</div>
                            <div className="feature-text">
                                <strong>Instant Confirmation</strong>
                                <span>Get your table booked in seconds</span>
                            </div>
                        </div>
                        <div className="res-feature">
                            <div className="feature-icon">🛋️</div>
                            <div className="feature-text">
                                <strong>Premium Seating</strong>
                                <span>Choose from our best indoor & outdoor spots</span>
                            </div>
                        </div>
                        <div className="res-feature">
                            <div className="feature-icon">🍷</div>
                            <div className="feature-text">
                                <strong>Private Dining</strong>
                                <span>Exclusive spaces for your special events</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="reserve-form-col fade-up-delay-1">
                    <div className="form-container-premium">
                        <div className="form-header">
                            <h3>BOOK YOUR TABLE</h3>
                            <p>Please fill out the form below</p>
                        </div>
                        <form className="reserve-form-premium">
                            <div className="form-row">
                                <div className="input-group-premium">
                                    <label>GUESTS</label>
                                    <input type="number" placeholder="No of Guest" className="form-input-premium" />
                                </div>
                                <div className="input-group-premium">
                                    <label>DATE</label>
                                    <input type="date" className="form-input-premium" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group-premium">
                                    <label>TIME</label>
                                    <input type="time" className="form-input-premium" />
                                </div>
                                <div className="input-group-premium">
                                    <label>PREFERENCE</label>
                                    <select className="form-input-premium">
                                        <option value="indoor">Indoor Dining</option>
                                        <option value="outdoor">Outdoor Terrace</option>
                                        <option value="private">Private Lounge</option>
                                        <option value="bar">Near the Bar</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group-premium full-width">
                                <label>FULL NAME</label>
                                <input type="text" placeholder="Your Full Name" className="form-input-premium" />
                            </div>

                            <div className="input-group-premium full-width">
                                <label>PHONE NUMBER</label>
                                <input type="tel" placeholder="+94 XX XXX XXXX" className="form-input-premium" />
                            </div>

                            <div className="input-group-premium full-width">
                                <label>SPECIAL REQUESTS</label>
                                <textarea placeholder="Message (Allergies, special occasions...)" className="form-input-premium textarea"></textarea>
                            </div>

                            <button type="submit" className="btn-submit-premium">
                                SECURE MY TABLE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReserveTable;
