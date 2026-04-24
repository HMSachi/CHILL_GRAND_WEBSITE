import React from 'react';
import '../../styles/pages/TableBooking.css';

const BookingForm = () => {
    return (
        <section className="booking-form-section" id="reservation-form">
            <div className="container">
                <div className="form-wrapper-v2 fade-up">
                    <div className="form-header-v2">
                        <span className="subtitle">Secure Your Spot</span>
                        <h2 className="title">Reservation Details</h2>
                        <div className="divider"></div>
                    </div>

                    <form className="main-booking-form">
                        <div className="form-grid">
                            <div className="form-group-v2">
                                <label>Full Name</label>
                                <input type="text" placeholder="Your Name" required />
                            </div>
                            <div className="form-group-v2">
                                <label>Phone Number</label>
                                <input type="tel" placeholder="+94 XX XXX XXXX" required />
                            </div>
                            <div className="form-group-v2">
                                <label>Date</label>
                                <input type="date" required />
                            </div>
                            <div className="form-group-v2">
                                <label>Time</label>
                                <select required>
                                    <option value="" disabled selected>Select Time</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="11:30 AM">11:30 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="12:30 PM">12:30 PM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="01:30 PM">01:30 PM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="02:30 PM">02:30 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="03:30 PM">03:30 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                    <option value="04:30 PM">04:30 PM</option>
                                    <option value="05:00 PM">05:00 PM</option>
                                    <option value="05:30 PM">05:30 PM</option>
                                    <option value="06:00 PM">06:00 PM</option>
                                    <option value="06:30 PM">06:30 PM</option>
                                    <option value="07:00 PM">07:00 PM</option>
                                    <option value="07:30 PM">07:30 PM</option>
                                    <option value="08:00 PM">08:00 PM</option>
                                    <option value="08:30 PM">08:30 PM</option>
                                    <option value="09:00 PM">09:00 PM</option>
                                    <option value="09:30 PM">09:30 PM</option>
                                    <option value="10:00 PM">10:00 PM</option>
                                    <option value="10:30 PM">10:30 PM</option>
                                    <option value="11:00 PM">11:00 PM</option>
                                </select>
                            </div>
                            <div className="form-group-v2">
                                <label>Guests</label>
                                <input type="number" min="1" placeholder="No. of Guests" required />
                            </div>
                            <div className="form-group-v2">
                                <label>Seating Preference</label>
                                <select>
                                    <option value="indoor">Indoor Dining</option>
                                    <option value="outdoor">Outdoor Terrace</option>
                                    <option value="private">Private Lounge</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group-v2 full-width">
                            <label>Special Instructions</label>
                            <textarea placeholder="Allergies, special occasions, or requests..."></textarea>
                        </div>
                        <div className="form-submit-v2">
                            <button type="submit" className="btn-confirm-v2">Confirm Reservation</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
