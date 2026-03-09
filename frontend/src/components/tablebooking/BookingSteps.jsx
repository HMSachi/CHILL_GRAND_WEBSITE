import React from 'react';
import '../../styles/pages/TableBooking.css';
import diningImg from '../../assets/private_dining.jpg';

const BookingSteps = () => {
    return (
        <div className="booking-steps-wrapper">
            <div className="booking-steps-box">
                <div className="steps-container">
                    {/* Left Content */}
                    <div className="steps-content">
                        <h2 className="steps-title">
                            How Table<br />Booking using<br /><span>360° view</span>
                        </h2>
                        <p className="steps-label">EASY ORDER IN 3 STEPS</p>

                        <div className="steps-list">
                            {/* Step 1 */}
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <div className="step-icon">1</div>
                                </div>
                                <div className="step-text">
                                    <h3>Select date & time</h3>
                                    <p>Choose your preffered date and time for your reservation.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <div className="step-icon">2</div>
                                </div>
                                <div className="step-text">
                                    <h3>Enter your details</h3>
                                    <p>Provide your name,email,phone number of guests.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <div className="step-icon">3</div>
                                </div>
                                <div className="step-text">
                                    <h3>Confirm your booking</h3>
                                    <p>Review your details and confirm your table instantly.</p>
                                </div>
                            </div>
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
