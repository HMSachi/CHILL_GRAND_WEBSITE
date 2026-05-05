import React from 'react';
import '../../styles/pages/TableBooking.css';
import diningImg from '../../assets/virtual_booking_360_concept.png';

const BookingSteps = () => {
    return (
        <div className="booking-steps-wrapper">
            <div className="booking-steps-box">
                <div className="steps-container">
                    {/* Left Content */}
                    <div className="steps-content">
                        <div className="steps-header-premium">
                            <h4 className="steps-subtitle-premium">Experience Immersive Virtual Selection</h4>
                            <h2 className="steps-title-premium">SECURE YOUR<br />PERFECT SPOT</h2>
                        </div>

                        <p className="steps-label-red">3-STEP JOURNEY</p>

                        <div className="steps-list">
                            {/* Step 1 */}
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <div className="step-icon">1</div>
                                </div>
                                <div className="step-text">
                                    <h3>Enter Details</h3>
                                    <p>Provide your name and contact phone number.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <div className="step-icon">2</div>
                                </div>
                                <div className="step-text">
                                    <h3>Select Schedule</h3>
                                    <p>Choose your preferred date, time, and number of guests.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <div className="step-icon">3</div>
                                </div>
                                <div className="step-text">
                                    <h3>Pick Your Table</h3>
                                    <p>Choose your favorite spot using the immersive 360° view.</p>
                                </div>
                            </div>
                        </div>

                        <div className="steps-cta-premium">
                            <a href="#reservation-form" className="btn-unique-booking">
                                <span className="btn-glow"></span>
                                <span className="btn-text">BOOK A TABLE</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="steps-image">
                        <img src={diningImg} alt="Dining Experience" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSteps;
