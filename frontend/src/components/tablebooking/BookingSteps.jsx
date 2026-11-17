import React from 'react';
import '../../styles/pages/TableBooking.css';

const BookingSteps = () => {
    return (
        <div className="tb-capsule-stepper-container">
            <div className="tb-capsule-stepper">
                <div className="tb-capsule-step-item">
                    <span className="tb-capsule-step-badge">1</span>
                    <span className="tb-capsule-step-text">Details</span>
                </div>
                <span className="tb-capsule-step-arrow">›</span>

                <div className="tb-capsule-step-item">
                    <span className="tb-capsule-step-badge">2</span>
                    <span className="tb-capsule-step-text">Availability</span>
                </div>
                <span className="tb-capsule-step-arrow">›</span>

                <div className="tb-capsule-step-item">
                    <span className="tb-capsule-step-badge">3</span>
                    <span className="tb-capsule-step-text">Confirm</span>
                </div>
            </div>
        </div>
    );
};

export default BookingSteps;
