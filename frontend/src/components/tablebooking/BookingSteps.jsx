import React from 'react';
import '../../styles/pages/TableBooking.css';
import diningImg from '../../assets/virtual_booking_360_concept.png';

const BookingSteps = () => {
    return (
        <div className="timeline-section-wrapper">
            <div className="timeline-container">
                {/* Left Content */}
                <div className="timeline-content-left">
                    <div className="timeline-header">
                        <h2 className="timeline-title">SECURE YOUR PERFECT SPOT</h2>
                    </div>

                    <div className="timeline-list">
                        {/* Step 1 */}
                        <div className="timeline-item">
                            <div className="timeline-dot">1</div>
                            <div className="timeline-text">
                                <h3>Enter Details</h3>
                                <p>Provide your name and contact phone number.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="timeline-item">
                            <div className="timeline-dot">2</div>
                            <div className="timeline-text">
                                <h3>Select Schedule</h3>
                                <p>Choose your preferred date, time, and number of guests.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="timeline-item">
                            <div className="timeline-dot">3</div>
                            <div className="timeline-text">
                                <h3>Pick Your Table</h3>
                                <p>Choose your favorite spot using the immersive 360° view.</p>
                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default BookingSteps;
