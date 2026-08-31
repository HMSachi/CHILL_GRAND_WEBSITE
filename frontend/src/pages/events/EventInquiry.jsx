import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaUsers, FaMoneyBillWave, FaSearch, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUtensils, FaTimes } from 'react-icons/fa';
import '../../styles/pages/EventInquiry.css';
import heroBg from '../../assets/bar.jpg';

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
        foodNeeded: false,
        foodDetails: '',
        decorNeeded: false,
        decorBudget: '',
        decorDetails: '',
        musicNeeded: false,
        musicBudget: '',
        photographyNeeded: false,
        photographyBudget: '',
        menuSuggestionsNeeded: false,
        menuBudget: '',
        menuDetails: '',
        budget: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    // Modal States
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedBookingId, setSubmittedBookingId] = useState(null);

    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackInput, setTrackInput] = useState('');
    const [trackedInquiry, setTrackedInquiry] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);
    const [trackError, setTrackError] = useState('');

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('track') === 'true') {
            setShowTrackModal(true);
            setTrackedInquiry(null);
            setTrackError('');
        }
    }, [location.search]);

    const [menuCategories, setMenuCategories] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/menu/categories`)
            .then(res => res.json())
            .then(data => {
                const cats = Array.isArray(data) ? data : [];
                setMenuCategories(cats);
            })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

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
            const adultsCount = parseInt(formData.adults, 10) || 0;
            const childrenCount = parseInt(formData.children, 10) || 0;
            const totalGuests = adultsCount + childrenCount;

            const reqParts = [
                `Guests Breakdown: ${adultsCount} Adults, ${childrenCount} Children (Total: ${totalGuests} Guests)`,
                `Time: ${formData.time || 'N/A'}`,
                `Decorations: ${formData.decorNeeded ? `Yes [Budget: ${formData.decorBudget || 'N/A'}, Notes: ${formData.decorDetails || 'None'}]` : 'No'}`,
                `Music/DJ: ${formData.musicNeeded ? `Yes [Budget: ${formData.musicBudget || 'N/A'}]` : 'No'}`,
                `Photography: ${formData.photographyNeeded ? `Yes [Budget: ${formData.photographyBudget || 'N/A'}]` : 'No'}`,
                `Menu Suggestions: ${formData.menuSuggestionsNeeded ? `Yes [Budget: ${formData.menuBudget || 'N/A'}, Notes: ${formData.menuDetails || 'None'}]` : 'No'}`
            ];

            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType,
                date: formData.date,
                guestCount: totalGuests,
                requirements: reqParts.join(' | ')
            };

            const response = await fetch(`${API_BASE_URL}/website/inquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const resData = await response.json();
                const newId = resData.data?.id || Math.floor(100 + Math.random() * 900);
                setSubmittedBookingId(newId);
                setShowSuccessModal(true);
                // Reset form
                setFormData({
                    name: '', email: '', phone: '', eventType: 'Birthday Parties', date: '', time: '',
                    adults: '', children: '', foodNeeded: false, foodDetails: '', decorNeeded: false,
                    decorBudget: '', decorDetails: '', musicNeeded: false, musicBudget: '',
                    photographyNeeded: false, photographyBudget: '', menuSuggestionsNeeded: false,
                    menuBudget: '', menuDetails: '', budget: '', notes: ''
                });
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

    const handleTrackBooking = async (searchVal) => {
        const queryId = (searchVal || trackInput).trim();
        if (!queryId) return;

        setTrackLoading(true);
        setTrackError('');
        setTrackedInquiry(null);

        try {
            const cleanId = queryId.replace(/#?EVT-/i, '');
            const res = await fetch(`${API_BASE_URL}/website/inquiries/${cleanId}`);
            if (res.ok) {
                const data = await res.json();
                setTrackedInquiry(data.inquiry);
            } else {
                const allRes = await fetch(`${API_BASE_URL}/website/inquiries`);
                if (allRes.ok) {
                    const allData = await allRes.json();
                    const found = (allData.inquiries || []).find(item =>
                        String(item.id) === cleanId ||
                        (item.phone && item.phone.includes(queryId)) ||
                        (item.email && item.email.toLowerCase() === queryId.toLowerCase())
                    );
                    if (found) {
                        setTrackedInquiry(found);
                    } else {
                        setTrackError(`No event booking request found for Booking ID #${queryId}`);
                    }
                } else {
                    setTrackError(`No event booking request found for Booking ID #${queryId}`);
                }
            }
        } catch (err) {
            console.error('Error tracking booking:', err);
            setTrackError('Failed to fetch booking details. Please try again.');
        } finally {
            setTrackLoading(false);
        }
    };

    const parseRequirementSections = (reqStr) => {
        if (!reqStr) return [];
        const cleaned = reqStr
            .replace(/\[Attached Menu[^\]]*\]/gi, '')
            .replace(/\[[^\]]*Status:\s*Accepted\]/gi, '')
            .replace(/Menu Suggestions Status:[^|]*/gi, '')
            .replace(/Rate:\s*Rs\.[^|]*/gi, '')
            .replace(/Total:\s*Rs\.[^|]*/gi, '')
            .trim();

        return cleaned.split(' | ').filter(p => p.trim().length > 0).map(part => {
            const idx = part.indexOf(':');
            if (idx !== -1) {
                return { label: part.substring(0, idx).trim(), value: part.substring(idx + 1).trim() };
            }
            return { label: '', value: part.trim() };
        }).filter(sec => {
            if (!sec.label || sec.label.toUpperCase() === 'DETAIL' || sec.label.toUpperCase() === '') return false;
            const label = sec.label.toUpperCase();
            return !label.includes('STATUS') && !label.includes('RATE') && !label.includes('TOTAL') && !label.includes('ATTACHED');
        });
    };

    const [showViewMenuModal, setShowViewMenuModal] = useState(false);
    const [customerAcceptLoading, setCustomerAcceptLoading] = useState(false);

    const handleCustomerAcceptBooking = async (inquiryId) => {
        if (!inquiryId) return;
        setCustomerAcceptLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/website/inquiries/${inquiryId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'accepted_by_customer' })
            });

            if (res.ok) {
                setTrackedInquiry(prev => prev ? { ...prev, status: 'accepted_by_customer' } : prev);
                alert('🎉 Thank you! Your event booking status has been updated to ACCEPTED BY CUSTOMER.');
            } else {
                alert('Failed to update booking status. Please try again.');
            }
        } catch (err) {
            console.error('Error updating customer acceptance status:', err);
            alert('Failed to connect to server.');
        } finally {
            setCustomerAcceptLoading(false);
        }
    };

    const parseAttachedMenusFromReq = (inquiry) => {
        if (!inquiry) return [];
        const reqStr = inquiry.requirements || '';
        const list = [];
        
        // Flexible & robust regex matching for attached menu tags capturing ALL items up to Rate:
        const matches = reqStr.matchAll(/\[Attached\s*([^:]+):\s*(.*?)\|\s*Rate:\s*Rs\.\s*([\d,.]+)\s*\|\s*Total:\s*Rs\.\s*([\d,.]+)\s*\]/gi);
        for (const match of matches) {
            const title = match[1].trim();
            const itemNames = match[2].trim();
            list.push({
                title,
                itemNames,
                rate: parseFloat(match[3].replace(/,/g, '')),
                totalCost: parseFloat(match[4].replace(/,/g, ''))
            });
        }

        if (list.length === 0) {
            // Flexible fallback regex if spacing or formatting varies slightly
            const fallbackMatches = reqStr.matchAll(/\[Attached\s*([^:]+):\s*(.*?)\|\s*Rate:[^\]]+\]/gi);
            for (const match of fallbackMatches) {
                const title = match[1].trim();
                const itemNames = match[2].trim();
                const rateMatch = match[0].match(/Rate:\s*Rs\.\s*([\d,.]+)/i);
                const totalMatch = match[0].match(/Total:\s*Rs\.\s*([\d,.]+)/i);
                list.push({
                    title,
                    itemNames,
                    rate: rateMatch ? parseFloat(rateMatch[1].replace(/,/g, '')) : 0,
                    totalCost: totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0
                });
            }
        }

        if (list.length === 0) {
            try {
                const cached = localStorage.getItem(`chillgrand_attached_menus_${inquiry.id}`);
                if (cached) {
                    const map = JSON.parse(cached);
                    return Object.values(map);
                }
            } catch (e) {}
        }
        return list;
    };

    const renderStructuredMenuCourses = (itemNamesStr) => {
        if (!itemNamesStr) return null;

        let coursesList = [];

        if (itemNamesStr.includes(':') && itemNamesStr.includes('|')) {
            coursesList = itemNamesStr.split('|').map(part => {
                const idx = part.indexOf(':');
                if (idx !== -1) {
                    return { courseName: part.substring(0, idx).trim(), itemName: part.substring(idx + 1).trim() };
                }
                return { courseName: 'Menu Item', itemName: part.trim() };
            }).filter(x => x.itemName);
        } else {
            const items = itemNamesStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
            const courseCategoryNames = [
                'Welcome Drink / Beverage',
                'Starter / Appetizer',
                'Main Course',
                'Dessert'
            ];

            items.forEach((item, idx) => {
                const lower = item.toLowerCase();
                let matchedCourse = '';

                if (lower.includes('drink') || lower.includes('juice') || lower.includes('cocktail') || lower.includes('beverage') || lower.includes('lime') || lower.includes('fruit') || lower.includes('watermelon') || lower.includes('mango') || lower.includes('orange')) {
                    matchedCourse = 'Welcome Drink / Beverage';
                } else if (lower.includes('bread') || lower.includes('roll') || lower.includes('wing') || lower.includes('starter') || lower.includes('appetizer') || lower.includes('soup') || lower.includes('roast')) {
                    matchedCourse = 'Starter / Appetizer';
                } else if (lower.includes('cake') || lower.includes('pudding') || lower.includes('ice cream') || lower.includes('dessert') || lower.includes('sweet')) {
                    matchedCourse = 'Dessert';
                } else if (lower.includes('rice') || lower.includes('kottu') || lower.includes('noodle') || lower.includes('pasta') || lower.includes('main') || lower.includes('biryani') || lower.includes('curry')) {
                    matchedCourse = 'Main Course';
                } else {
                    matchedCourse = courseCategoryNames[Math.min(idx, courseCategoryNames.length - 1)];
                }

                coursesList.push({ courseName: matchedCourse, itemName: item });
            });
        }

        const courseTheme = {
            'Welcome Drink / Beverage': { icon: '🍹', color: '#ffb74d' },
            'Starter / Appetizer': { icon: '🥗', color: '#81c784' },
            'Main Course': { icon: '🍛', color: '#e5c158' },
            'Dessert': { icon: '🍰', color: '#f48fb1' },
            'Kids Special': { icon: '🧸', color: '#64b5f6' }
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {coursesList.map((c, cIdx) => {
                    const theme = courseTheme[c.courseName] || { icon: '🍽️', color: '#e5c158' };
                    return (
                        <div key={cIdx} style={{ background: '#111111', padding: '10px 14px', borderRadius: '10px', borderLeft: `4px solid ${theme.color}`, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ color: theme.color, fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{theme.icon}</span> {c.courseName}
                            </span>
                            <strong style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: '700' }}>
                                {c.itemName}
                            </strong>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getGuestsBreakdown = (inquiry) => {
        if (!inquiry || !inquiry.requirements) return `${inquiry?.guest_count || 0} Guests`;
        const match = inquiry.requirements.match(/Guests Breakdown:\s*([^|]+)/i);
        if (match && match[1]) {
            return match[1].trim();
        }
        return `${inquiry.guest_count || 0} Guests`;
    };

    return (
        <div className="inquiry-page">
            <div className="inquiry-hero" style={{ backgroundImage: `url(${heroBg})`, paddingTop: '120px', minHeight: '340px' }}>
                <div className="inquiry-hero-overlay" style={{ paddingTop: '80px' }}>
                    <h1 style={{ marginTop: '20px' }}>Plan Your <span>Dream Event</span></h1>
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
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+94 77 123 4567" />
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
                                        <option value="Batch Meetup">Batch Meetup</option>
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
                                        <button type="button" className="counter-btn" onClick={() => handleDecrement('adults')}>-</button>
                                        <input type="number" name="adults" value={formData.adults} onChange={handleChange} placeholder="0" min="0" />
                                        <button type="button" className="counter-btn" onClick={() => handleIncrement('adults')}>+</button>
                                    </div>
                                </div>
                                <div className="guest-input-group">
                                    <span>Children</span>
                                    <div className="guest-counter">
                                        <button type="button" className="counter-btn" onClick={() => handleDecrement('children')}>-</button>
                                        <input type="number" name="children" value={formData.children} onChange={handleChange} placeholder="0" min="0" />
                                        <button type="button" className="counter-btn" onClick={() => handleIncrement('children')}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Services */}
                    <section className="form-section">
                        <h2 className="section-title">Additional Event Services</h2>
                        <div className="services-grid">
                            <div className={`service-item ${formData.decorNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="decorNeeded" checked={formData.decorNeeded} onChange={handleChange} />
                                    <span>Do you need Event Decorations?</span>
                                </label>
                                {formData.decorNeeded && (
                                    <div className="service-extra-content">
                                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                                            <label style={{ color: '#ffcc00', fontWeight: '700' }}>Decorations Estimated Budget (Rs.)</label>
                                            <div className="input-wrapper">
                                                <FaMoneyBillWave className="input-icon" />
                                                <input type="text" name="decorBudget" value={formData.decorBudget} onChange={handleChange} placeholder="e.g. Rs. 50,000" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`service-item ${formData.musicNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="musicNeeded" checked={formData.musicNeeded} onChange={handleChange} />
                                    <span>Do you need Music / DJ?</span>
                                </label>
                                {formData.musicNeeded && (
                                    <div className="service-extra-content">
                                        <div className="form-group">
                                            <label style={{ color: '#ffcc00', fontWeight: '700' }}>Music / DJ Estimated Budget (Rs.)</label>
                                            <div className="input-wrapper">
                                                <FaMoneyBillWave className="input-icon" />
                                                <input type="text" name="musicBudget" value={formData.musicBudget} onChange={handleChange} placeholder="e.g. Rs. 40,000" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`service-item ${formData.photographyNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="photographyNeeded" checked={formData.photographyNeeded} onChange={handleChange} />
                                    <span>Do you need Photography?</span>
                                </label>
                                {formData.photographyNeeded && (
                                    <div className="service-extra-content">
                                        <div className="form-group">
                                            <label style={{ color: '#ffcc00', fontWeight: '700' }}>Photography Estimated Budget (Rs.)</label>
                                            <div className="input-wrapper">
                                                <FaMoneyBillWave className="input-icon" />
                                                <input type="text" name="photographyBudget" value={formData.photographyBudget} onChange={handleChange} placeholder="e.g. Rs. 60,000" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`service-item ${formData.menuSuggestionsNeeded ? 'selected' : ''}`}>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="menuSuggestionsNeeded" checked={formData.menuSuggestionsNeeded} onChange={handleChange} />
                                    <span>Need menu suggestions?</span>
                                </label>
                                {formData.menuSuggestionsNeeded && (
                                    <div className="service-extra-content">
                                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                                            <label style={{ color: '#ffcc00', fontWeight: '700' }}>Menu / Food Estimated Budget (Rs.)</label>
                                            <div className="input-wrapper">
                                                <FaMoneyBillWave className="input-icon" />
                                                <input type="text" name="menuBudget" value={formData.menuBudget} onChange={handleChange} placeholder="e.g. Rs. 150,000" />
                                            </div>
                                        </div>
                                        <textarea
                                            name="menuDetails"
                                            value={formData.menuDetails}
                                            onChange={handleChange}
                                            placeholder="Preferred cuisine, dietary requirements, or menu notes..."
                                            className="service-textarea"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <Link to="/plan-event" className="btn-cancel">Return to Events</Link>
                        <button type="submit" className="btn-submit-inquiry" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Form'}
                        </button>
                    </div>

                </form>
            </div>

            {/* ========================================================================= */}
            {/* 1. SUCCESS POPUP MODAL ON SUBMIT FORM                                     */}
            {/* ========================================================================= */}
            {showSuccessModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#161616', border: '2px solid #e5c158', borderRadius: '24px', padding: '36px', maxWidth: '540px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(229,193,88,0.3)', color: '#fff' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
                        <h2 style={{ color: '#e5c158', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 10px 0' }}>
                            Booking Recorded Successfully!
                        </h2>
                        <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            Your event booking request has been recorded in our system. You can check status, accepted services, and curated AI menus anytime using your Booking ID:
                        </p>

                        <div style={{ background: '#111', border: '1px dashed #e5c158', padding: '16px', borderRadius: '16px', marginBottom: '28px' }}>
                            <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '4px' }}>YOUR EVENT BOOKING ID</span>
                            <strong style={{ fontSize: '2rem', color: '#e5c158', letterSpacing: '2px' }}>#EVT-{submittedBookingId}</strong>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setShowTrackModal(true);
                                    setTrackInput(String(submittedBookingId));
                                    handleTrackBooking(String(submittedBookingId));
                                }}
                                style={{ padding: '14px 28px', background: '#e5c158', border: 'none', borderRadius: '14px', color: '#000', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(229,193,88,0.3)' }}
                            >
                                👁️ View Your Booking Details
                            </button>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                style={{ padding: '14px 24px', background: '#252525', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 2. TRACK & VIEW BOOKING DETAILS MODAL                                      */}
            {/* ========================================================================= */}
            {showTrackModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ background: '#161616', border: '1px solid #e5c158', borderRadius: '24px', padding: '32px', maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                        
                        <button
                            onClick={() => setShowTrackModal(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: '#252525', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FaTimes />
                        </button>

                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ color: '#e5c158', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                ✨ Customer Self-Service Portal
                            </span>
                            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>
                                Track & View Your Booking Status
                            </h2>
                        </div>

                        {/* Search Input Box */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <input
                                type="text"
                                placeholder="Enter Booking ID (e.g. 101 or #EVT-101) or Phone / Email..."
                                value={trackInput}
                                onChange={e => setTrackInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleTrackBooking()}
                                style={{ flex: 1, padding: '12px 18px', background: '#222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem' }}
                            />
                            <button
                                onClick={() => handleTrackBooking()}
                                disabled={trackLoading}
                                style={{ padding: '12px 24px', background: '#e5c158', border: 'none', borderRadius: '12px', color: '#000', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {trackLoading ? 'Searching...' : <><FaSearch /> Search</>}
                            </button>
                        </div>

                        {trackError && (
                            <div style={{ background: 'rgba(255,77,77,0.15)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
                                ⚠️ {trackError}
                            </div>
                        )}

                        {/* Tracked Inquiry Results */}
                        {trackedInquiry && (() => {
                            const isCustomerAccepted = trackedInquiry.status === 'accepted_by_customer';
                            const isAccepted = trackedInquiry.status === 'accepted' || trackedInquiry.status === 'confirmed' || isCustomerAccepted;
                            const isCancelled = trackedInquiry.status === 'cancelled';
                            const reqSections = parseRequirementSections(trackedInquiry.requirements);
                            const attachedMenusList = parseAttachedMenusFromReq(trackedInquiry);

                            return (
                                <div className="animate-fade-in" style={{ spaceY: '20px' }}>
                                    
                                    {/* Overview Header */}
                                    <div style={{ background: '#111', border: `1px solid ${isCustomerAccepted ? '#4CAF50' : isAccepted ? '#e5c158' : isCancelled ? '#ff4d4d' : '#e5c158'}`, borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: '800' }}>BOOKING ID</span>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#e5c158', margin: 0 }}>#EVT-{trackedInquiry.id}</h3>
                                            <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>
                                                👤 {trackedInquiry.name} ({trackedInquiry.phone})
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '4px' }}>OVERALL STATUS</span>
                                            <span style={{
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                fontSize: '0.82rem',
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                background: isCustomerAccepted ? 'rgba(76, 175, 80, 0.25)' : isAccepted ? 'rgba(229, 193, 88, 0.2)' : isCancelled ? 'rgba(255, 77, 77, 0.2)' : 'rgba(229, 193, 88, 0.2)',
                                                color: isCustomerAccepted ? '#4CAF50' : isAccepted ? '#e5c158' : isCancelled ? '#ff4d4d' : '#e5c158',
                                                border: `1px solid ${isCustomerAccepted ? '#4CAF50' : isAccepted ? '#e5c158' : isCancelled ? '#ff4d4d' : '#e5c158'}`
                                            }}>
                                                {isCustomerAccepted ? '✅ ACCEPTED BY CUSTOMER' : isAccepted ? '✅ RESTAURANT APPROVED' : isCancelled ? '❌ CANCELLED' : '⏳ PENDING REVIEW'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Event Details Grid */}
                                    <div style={{ background: '#202020', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.88rem' }}>
                                        <div>
                                            <span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>EVENT TYPE</span>
                                            <strong style={{ color: '#e5c158' }}>🎉 {trackedInquiry.event_type}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>TARGET EVENT DATE</span>
                                            <strong style={{ color: '#fff' }}>📅 {trackedInquiry.event_date}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>GUESTS BREAKDOWN</span>
                                            <strong style={{ color: '#fff' }}>👥 {getGuestsBreakdown(trackedInquiry)}</strong>
                                        </div>
                                    </div>

                                    {/* Individual Services Status List */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{ color: '#e5c158', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '14px' }}>
                                            📋 Requested Services Status
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {reqSections.map((sec, idx) => {
                                                const isMenuSec = sec.label.toUpperCase().includes('MENU');
                                                const hasAcceptedTag = trackedInquiry.requirements?.includes(`[${sec.label} Status: Accepted]`) ||
                                                                       trackedInquiry.requirements?.includes(`[${sec.label.toUpperCase()} Status: Accepted]`) ||
                                                                       (isMenuSec && (trackedInquiry.requirements?.includes('Menu Suggestions Status: Accepted') || trackedInquiry.requirements?.includes('[Attached Menu')));
                                                const cleanVal = sec.value.replace(/\[[^\]]*Status:\s*Accepted\]|\[Attached Menu[^\]]*\]/gi, '').trim();

                                                return (
                                                    <div key={idx} style={{ background: '#111', padding: '14px 18px', borderRadius: '12px', border: hasAcceptedTag ? '1px solid #4CAF50' : '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                                        <div>
                                                            <strong style={{ color: '#e5c158', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block' }}>{sec.label}</strong>
                                                            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{cleanVal}</span>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {isMenuSec && (hasAcceptedTag || attachedMenusList.length > 0) && (
                                                                <button
                                                                    onClick={() => setShowViewMenuModal(true)}
                                                                    style={{
                                                                        padding: '6px 14px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '0.78rem',
                                                                        fontWeight: '800',
                                                                        background: '#e5c158',
                                                                        color: '#000',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '6px',
                                                                        boxShadow: '0 4px 12px rgba(229,193,88,0.3)'
                                                                    }}
                                                                >
                                                                    👁️ View Menu
                                                                </button>
                                                            )}

                                                            <span style={{
                                                                padding: '4px 12px',
                                                                borderRadius: '14px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '800',
                                                                background: hasAcceptedTag ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.05)',
                                                                color: hasAcceptedTag ? '#4CAF50' : '#888',
                                                                border: `1px solid ${hasAcceptedTag ? '#4CAF50' : 'rgba(255,255,255,0.15)'}`
                                                            }}>
                                                                {hasAcceptedTag ? '✅ ACCEPTED' : '⏳ PENDING'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Customer Acceptance Action Area */}
                                    <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.15)', textAlign: 'center' }}>
                                        {isCustomerAccepted ? (
                                            <div style={{ background: 'rgba(76, 175, 80, 0.15)', border: '2px solid #4CAF50', borderRadius: '16px', padding: '18px', color: '#4CAF50', fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                <FaCheckCircle size={22} />
                                                <span>This Event Booking Has Been Accepted By You! Overall Status: ACCEPTED BY CUSTOMER</span>
                                            </div>
                                        ) : isCancelled ? (
                                            <div style={{ color: '#ff4d4d', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                                This booking request has been cancelled.
                                            </div>
                                        ) : (
                                            <div style={{ background: '#181818', border: '1px solid #e5c158', borderRadius: '18px', padding: '20px' }}>
                                                <h4 style={{ color: '#e5c158', fontSize: '1.1rem', fontWeight: '900', margin: '0 0 8px 0' }}>
                                                    Are you satisfied with the event services & menu options?
                                                </h4>
                                                <p style={{ color: '#ccc', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
                                                    Click below to confirm your booking. The overall status will update to <strong>ACCEPTED BY CUSTOMER</strong>.
                                                </p>
                                                <button
                                                    onClick={() => handleCustomerAcceptBooking(trackedInquiry.id)}
                                                    disabled={customerAcceptLoading}
                                                    style={{
                                                        padding: '14px 32px',
                                                        background: '#4CAF50',
                                                        border: 'none',
                                                        borderRadius: '14px',
                                                        color: '#fff',
                                                        fontWeight: '900',
                                                        fontSize: '1rem',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    {customerAcceptLoading ? 'Updating...' : <><FaCheckCircle /> Accept by Customer</>}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })()}

                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 3. DEDICATED VIEW ACCEPTED MENUS POPUP MODAL                               */}
            {/* ========================================================================= */}
            {showViewMenuModal && trackedInquiry && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#161616', border: '2px solid #e5c158', borderRadius: '24px', padding: '32px', maxWidth: '750px', width: '100%', maxHeight: '85vh', overflowY: 'auto', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(229,193,88,0.3)' }}>
                        <button
                            onClick={() => setShowViewMenuModal(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: '#252525', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FaTimes />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <span style={{ color: '#e5c158', fontSize: '0.78rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                🍽️ Accepted Event Menu Suggestions
                            </span>
                            <h2 style={{ margin: '6px 0 0 0', fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>
                                Curated Menus for Booking #EVT-{trackedInquiry.id}
                            </h2>
                        </div>

                        {(() => {
                            const menus = parseAttachedMenusFromReq(trackedInquiry);
                            if (menus.length === 0) {
                                return (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                        No specific menu suggestions attached yet.
                                    </div>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {menus.map((menu, idx) => (
                                        <div key={idx} style={{ background: '#1c1810', border: '2px solid #e5c158', borderRadius: '20px', padding: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#e5c158', fontWeight: '900' }}>
                                                    🌟 {menu.title} {menus.length > 1 ? `(Option ${idx + 1})` : ''}
                                                </h3>
                                                <span style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', border: '1px solid #4CAF50', padding: '4px 12px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    ✅ Accepted by Restaurant
                                                </span>
                                            </div>

                                            <div style={{ background: '#111', borderRadius: '14px', padding: '16px', marginBottom: '18px' }}>
                                                <h4 style={{ color: '#aaa', fontSize: '0.8rem', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '1px' }}>
                                                    Course Breakdown & Food Items:
                                                </h4>
                                                {renderStructuredMenuCourses(menu.itemNames)}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#222', padding: '14px', borderRadius: '12px', fontSize: '0.9rem' }}>
                                                <div>
                                                    <span style={{ color: '#888', display: 'block', fontSize: '0.75rem' }}>PER GUEST RATE</span>
                                                    <strong style={{ color: '#e5c158', fontSize: '1.05rem' }}>
                                                        Rs. {menu.rate ? parseFloat(menu.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#888', display: 'block', fontSize: '0.75rem' }}>TOTAL ESTIMATED COST</span>
                                                    <strong style={{ color: '#4CAF50', fontSize: '1.15rem' }}>
                                                        Rs. {menu.totalCost ? parseFloat(menu.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}

                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowViewMenuModal(false)}
                                style={{ padding: '12px 28px', background: '#252525', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Close Menu Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EventInquiry;
