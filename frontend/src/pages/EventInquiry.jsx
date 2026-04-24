import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaUsers, FaChild, FaMoneyBillWave, FaPen } from 'react-icons/fa';
import '../styles/pages/EventInquiry.css';
import heroBg from '../assets/bar.jpg';

const EventInquiry = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        time: '',
        adults: '',
        children: '',
        venuePref: 'Indoor',
        foodNeeded: false,
        foodDetails: '',
        decorNeeded: false,
        decorDetails: '',
        musicNeeded: false,
        photographyNeeded: false,
        budget: '',
        notes: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Mapping frontend model to backend model
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType,
                date: formData.date,
                guestCount: parseInt(formData.adults || 0) + parseInt(formData.children || 0),
                requirements: `Time: ${formData.time}, Venue: ${formData.venuePref}, Food: ${formData.foodNeeded ? formData.foodDetails : 'No'}, Decor: ${formData.decorNeeded ? formData.decorDetails : 'No'}, Music: ${formData.musicNeeded}, Photography: ${formData.photographyNeeded}, Budget: ${formData.budget}, Notes: ${formData.notes}`
            };

            const response = await fetch("http://localhost:5000/api/website/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Inquiry sent! Our team will contact you soon.' });
                // Reset form optionally
            } else {
                const data = await response.json();
                setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
            }
        } catch {
            setStatus({ type: 'error', message: 'Failed to connect to server.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inquiry-page">
            <div className="inquiry-hero" style={{ backgroundImage: `url(${heroBg})` }}>
                <div className="inquiry-hero-overlay">
                    <h1>Plan Your <span>Dream Event</span></h1>
                </div>
            </div>

            <div className="inquiry-container">
                <form onSubmit={handleSubmit} className="inquiry-form">

                    {/* Section 1: Contact Info */}
                    <section className="form-section">
                        <h2 className="section-title">Contact Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-wrapper">
                                    <FaPhone className="input-icon" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Event Basics */}
                    <section className="form-section">
                        <h2 className="section-title">Event Basics</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Event Type</label>
                                <div className="input-wrapper">
                                    <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                                        <option value="">Select Type</option>
                                        <option value="Birthday">Birthday Party</option>
                                        <option value="Anniversary">Anniversary</option>
                                        <option value="Wedding">Wedding</option>
                                        <option value="Corporate">Corporate Event</option>
                                        <option value="Gathering">Social Gathering</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <div className="input-wrapper">
                                    <FaCalendarAlt className="input-icon" />
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Preferred Time</label>
                                <div className="input-wrapper">
                                    <FaClock className="input-icon" />
                                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Guest Details */}
                    <section className="form-section">
                        <h2 className="section-title">Guest Details</h2>
                        <div className="form-group">
                            <label>How many guests are participating?</label>
                            <div className="guest-inputs">
                                <div className="guest-input-group">
                                    <span>Adults</span>
                                    <div className="input-wrapper">
                                        <FaUsers className="input-icon" />
                                        <input type="number" name="adults" value={formData.adults} onChange={handleChange} required min="0" placeholder="0" />
                                    </div>
                                </div>
                                <div className="guest-input-group">
                                    <span>Children</span>
                                    <div className="input-wrapper">
                                        <FaChild className="input-icon" />
                                        <input type="number" name="children" value={formData.children} onChange={handleChange} min="0" placeholder="0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Venue & Services */}
                    <section className="form-section">
                        <h2 className="section-title">Venue & Services</h2>

                        <div className="form-group">
                            <label>Do you prefer an Indoor or Outdoor event?</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="venuePref" value="Indoor" checked={formData.venuePref === 'Indoor'} onChange={handleChange} />
                                    Indoor
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="venuePref" value="Outdoor" checked={formData.venuePref === 'Outdoor'} onChange={handleChange} />
                                    Outdoor
                                </label>
                            </div>
                        </div>

                        <div className="services-grid">
                            <div className="service-item">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="foodNeeded" checked={formData.foodNeeded} onChange={handleChange} />
                                    Do you need Food & Catering menus?
                                </label>
                                {formData.foodNeeded && (
                                    <textarea
                                        name="foodDetails"
                                        value={formData.foodDetails}
                                        onChange={handleChange}
                                        placeholder="Describe your menu preferences (e.g., Vegetarian, Italian, Buffet...)"
                                        className="service-details"
                                    />
                                )}
                            </div>

                            <div className="service-item">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="decorNeeded" checked={formData.decorNeeded} onChange={handleChange} />
                                    Do you need Decorations?
                                </label>
                                {formData.decorNeeded && (
                                    <textarea
                                        name="decorDetails"
                                        value={formData.decorDetails}
                                        onChange={handleChange}
                                        placeholder="Describe your theme or color preferences..."
                                        className="service-details"
                                    />
                                )}
                            </div>

                            <div className="service-item">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="musicNeeded" checked={formData.musicNeeded} onChange={handleChange} />
                                    Do you need Music / DJ?
                                </label>
                            </div>

                            <div className="service-item">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="photographyNeeded" checked={formData.photographyNeeded} onChange={handleChange} />
                                    Do you need Photography?
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Budget & Notes */}
                    <section className="form-section">
                        <h2 className="section-title">Budget & Additional Notes</h2>
                        <div className="form-group">
                            <label>Estimated Budget</label>
                            <div className="input-wrapper">
                                <FaMoneyBillWave className="input-icon" />
                                <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. $5000" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Additional Notes</label>
                            <div className="input-wrapper">
                                <FaPen className="input-icon" />
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Any special requests or questions?" />
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit-inquiry">Submit Inquiry</button>
                        <Link to="/plan-event" className="btn-cancel">Cancel</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EventInquiry;
