import React from 'react';
import '../../styles/components/ReserveTable.css';

const ReserveTable = () => {
    return (
        <section className="reserve-table" id="booking">
            <div className="container reserve-container-split">
                <div className="reserve-info-col">
                    <div className="section-header-warehouse left-align">
                        <div className="header-accent">Reservations</div>
                        <h2 className="header-title">EXPERIENCE<br />CHILL GRAND</h2>
                    </div>
                    <p className="reserve-description">
                        Secure your place for an exceptional dining experience. From intimate dinners
                        to grand celebrations, we ensure every detail is perfectly crafted for you.
                    </p>
                    <div className="reserve-features">
                        <div className="res-feature"><span>✓</span> Instant Confirmation</div>
                        <div className="res-feature"><span>✓</span> Premium Seating Options</div>
                        <div className="res-feature"><span>✓</span> Private Dining Available</div>
                    </div>
                </div>

                <div className="reserve-form-col">
                    <form className="reserve-form-premium">
                        <div className="form-row">
                            <div className="input-group">
                                <label>GUESTS</label>
                                <input type="number" placeholder="No of Guest" className="form-input-premium" />
                            </div>
                            <div className="input-group">
                                <label>DATE</label>
                                <input type="date" className="form-input-premium" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>TIME</label>
                                <input type="time" className="form-input-premium" />
                            </div>
                            <div className="input-group">
                                <label>TABLE PREFERENCE</label>
                                <input type="text" placeholder="e.g. Near Window" className="form-input-premium" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>FULL NAME</label>
                                <input type="text" placeholder="Enter your name" className="form-input-premium" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>PHONE NUMBER</label>
                                <input type="tel" placeholder="+94 XX XXX XXXX" className="form-input-premium" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>SPECIAL REQUIREMENTS</label>
                                <textarea placeholder="Allergies, occasions, etc." className="form-input-premium textarea"></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit-premium">
                            CONFIRM RESERVATION
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ReserveTable;
