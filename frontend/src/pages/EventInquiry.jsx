import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaUsers, FaChild, FaMoneyBillWave, FaPen, FaPlus, FaMinus, FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/pages/EventInquiry.css';
import heroBg from '../assets/bar.jpg';

const EventInquiry = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: 'Birthday Parties',
        date: '',
        time: '',
        adults: '',
        children: '',
        selectedTableId: null,
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

    const [menuCategories, setMenuCategories] = useState([]);
    const [selectedFoodCats, setSelectedFoodCats] = useState([]);
    const [selectedDecorCats, setSelectedDecorCats] = useState([]);

    const [places, setPlaces] = useState([]);
    const [tables, setTables] = useState([]);

    const decorCategoryList = ['Flowers', 'Balloons', 'Lights', 'Special Theme', 'Simple Setup', 'Luxury Setup', 'Candles'];

    useEffect(() => {
        // Fetch Categories
        fetch('http://localhost:5000/api/menu/categories')
            .then(res => res.json())
            .then(data => {
                const cats = Array.isArray(data) ? data : [];
                setMenuCategories(cats);
            })
            .catch(err => console.error('Error fetching categories:', err));

        // Fetch Places
        fetch('http://localhost:5000/api/places')
            .then(res => res.json())
            .then(data => {
                if (data.places) setPlaces(data.places);
            })
            .catch(err => console.error('Error fetching places:', err));

        // Fetch Tables
        fetch('http://localhost:5000/api/tables')
            .then(res => res.json())
            .then(data => {
                if (data.tables) setTables(data.tables);
            })
            .catch(err => console.error('Error fetching tables:', err));
    }, []);

    const toggleFoodCat = (catName) => {
        setSelectedFoodCats(prev =>
            prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
        );
    };

    const toggleDecorCat = (catName) => {
        setSelectedDecorCats(prev =>
            prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
        );
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleIncrement = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: (parseInt(prev[name]) || 0) + 1
        }));
    };

    const handleDecrement = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: Math.max(0, (parseInt(prev[name]) || 0) - 1)
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
                requirements: `Time: ${formData.time}, Table ID: ${formData.selectedTableId || 'Not Selected'}, Food: ${formData.foodNeeded ? `Selections: [${selectedFoodCats.join(', ')}] Notes: ${formData.foodDetails}` : 'No'}, Decor: ${formData.decorNeeded ? `Selections: [${selectedDecorCats.join(', ')}] Notes: ${formData.decorDetails}` : 'No'}, Music: ${formData.musicNeeded}, Photography: ${formData.photographyNeeded}, Budget: ${formData.budget}, Notes: ${formData.notes}`
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
                    <p>Tell us about your vision, and we'll craft an exceptional experience tailored just for you.</p>
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
                                        <option value="Birthday Parties">Birthday Parties</option>
                                        <option value="Private Dining">Private Dining</option>
                                        <option value="DJ / Live Music">DJ / Live Music</option>
                                        <option value="Family Gatherings">Family Gatherings</option>
                                        <option value="Corporate Events">Corporate Events</option>
                                        <option value="Graduation / Farewell">Graduation / Farewell</option>
                                        <option value="Engagement">Engagement</option>
                                        <option value="Anniversaries">Anniversaries</option>
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
                                    <div className="guest-counter">
                                        <button type="button" className="counter-btn" onClick={() => handleDecrement('adults')}>
                                            <FaMinus />
                                        </button>
                                        <input
                                            type="number"
                                            name="adults"
                                            value={formData.adults}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="0"
                                        />
                                        <button type="button" className="counter-btn" onClick={() => handleIncrement('adults')}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                                <div className="guest-input-group">
                                    <span>Children</span>
                                    <div className="guest-counter">
                                        <button type="button" className="counter-btn" onClick={() => handleDecrement('children')}>
                                            <FaMinus />
                                        </button>
                                        <input
                                            type="number"
                                            name="children"
                                            value={formData.children}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="0"
                                        />
                                        <button type="button" className="counter-btn" onClick={() => handleIncrement('children')}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Venue & Services */}
                    <section className="form-section">
                        <h2 className="section-title">Venue & Services</h2>

                        <div className="form-group">
                            <label>Select a Table</label>
                            {places.length > 0 ? (
                                places.map(place => {
                                    const placeTables = tables.filter(t => t.place_id === place.id);
                                    if (placeTables.length === 0) return null;
                                    return (
                                        <div key={place.id} className="place-section" style={{ marginBottom: '1.5rem' }}>
                                            <h3 className="place-header" style={{ color: 'var(--primary-yellow)', marginBottom: '0.8rem', fontSize: '1rem', borderBottom: '1px solid rgba(255, 215, 0, 0.2)', paddingBottom: '5px' }}>{place.place_name}</h3>
                                            <div className="venue-card-group tables-grid">
                                                {placeTables.map(table => (
                                                    <div
                                                        key={table.id}
                                                        className={`venue-card ${formData.selectedTableId === table.id ? 'active' : ''}`}
                                                        onClick={() => setFormData(prev => ({ ...prev, selectedTableId: table.id }))}
                                                    >
                                                        <span className="venue-name">Table #{table.id}</span>
                                                        <span className="venue-desc">{table.seats} Seats</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className="chips-loading">Loading tables...</span>
                            )}
                        </div>

                        <div className="services-grid">
                            <div className={`service-item ${formData.foodNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="foodNeeded" checked={formData.foodNeeded} onChange={handleChange} />
                                    Do you need Food & Catering menus?
                                </label>
                                {formData.foodNeeded && (
                                    <div className="service-extra-content">
                                        <div className="category-chips-container">
                                            {menuCategories.length > 0 ? (
                                                menuCategories.map(cat => (
                                                    <button
                                                        key={cat.id || cat.name}
                                                        type="button"
                                                        className={`category-chip ${selectedFoodCats.includes(cat.name) ? 'active' : ''}`}
                                                        onClick={() => toggleFoodCat(cat.name)}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="chips-loading">Loading menu categories...</span>
                                            )}
                                        </div>
                                        <a href="/categories" target="_blank" rel="noopener noreferrer" className="qr-menu-link">
                                            <span>View Full QR Menu</span>
                                            <FaExternalLinkAlt className="qr-menu-icon" />
                                        </a>
                                        <textarea
                                            name="foodDetails"
                                            value={formData.foodDetails}
                                            onChange={handleChange}
                                            placeholder="Paste specific selections here or describe preferences..."
                                            className="service-textarea"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={`service-item ${formData.decorNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="decorNeeded" checked={formData.decorNeeded} onChange={handleChange} />
                                    Do you need Decorations?
                                </label>
                                {formData.decorNeeded && (
                                    <div className="service-extra-content">
                                        <div className="category-chips-container">
                                            {decorCategoryList.map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    className={`category-chip ${selectedDecorCats.includes(cat) ? 'active' : ''}`}
                                                    onClick={() => toggleDecorCat(cat)}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            name="decorDetails"
                                            value={formData.decorDetails}
                                            onChange={handleChange}
                                            placeholder="Additional theme or color preferences..."
                                            className="service-textarea"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={`service-item ${formData.musicNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="musicNeeded" checked={formData.musicNeeded} onChange={handleChange} />
                                    Do you need Music / DJ?
                                </label>
                            </div>

                            <div className={`service-item ${formData.photographyNeeded ? 'selected' : ''}`}>
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
                            <label>Estimated Budget (Rs.)</label>
                            <div className="input-wrapper">
                                <FaMoneyBillWave className="input-icon" />
                                <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. Rs. 500,000" />
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
                        <Link to="/plan-event" className="btn-cancel">Return to Events</Link>
                        <button type="submit" className="btn-submit-inquiry" disabled={loading}>
                            {loading ? 'Processing...' : 'Submit Inquiry'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EventInquiry;
