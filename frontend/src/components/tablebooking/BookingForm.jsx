import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '../../styles/pages/TableBooking.css';

const createTableMarker = (id, yaw, pitch, label) => ({
    id: `table-${id}-${label}`,
    position: { yaw, pitch },
    html: `
        <div class="table-marker-embedded">
            <div class="marker-pulse-embedded"></div>
            <div class="marker-content">●</div>
        </div>
    `,
    size: { width: 35, height: 35 },
    anchor: 'center center',
    tooltip: `Select Table: ${label}`,
    data: { label }
});

const tableMarkers = [
    createTableMarker('window-1', 1.0, -0.2, 'T1 (Window)'),
    createTableMarker('window-2', 1.4, -0.2, 'T2 (Window)'),
    createTableMarker('center-1', 2.0, -0.15, 'C1 (Center Hall)'),
    createTableMarker('center-2', 2.5, -0.15, 'C2 (Center Hall)'),
    createTableMarker('vip-1', 3.14, -0.1, 'VIP 1 (Private)')
];

const BookingForm = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        seatingPreference: '',
        specialInstructions: ''
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tableId = queryParams.get('tableId');
        if (tableId) {
            setFormData(prev => ({
                ...prev,
                specialInstructions: prev.specialInstructions
                    ? prev.specialInstructions + `\nPre-selected Table No: ${tableId}`
                    : `Pre-selected Table No: ${tableId}`
            }));
        }
    }, [location]);

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleViewerReady = (instance) => {
        const markersPlugin = instance.getPlugin(MarkersPlugin);
        markersPlugin.addEventListener('select-marker', ({ marker }) => {
            if (marker.id.startsWith('table-')) {
                setFormData(prev => ({ ...prev, seatingPreference: marker.data.label }));
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch("http://localhost:5000/api/website/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Reservation requested! We will contact you soon.' });
                setFormData({ name: '', phone: '', date: '', time: '', guests: '', seatingPreference: '', specialInstructions: '' });
            } else {
                setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to connect to server.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="booking-form-section" id="reservation-form">
            <div className="container">
                <div className="form-wrapper-v2 fade-up">
                    <div className="form-header-v2">
                        <span className="subtitle">Secure Your Spot</span>
                        <h2 className="title">Reservation Details</h2>
                        <div className="divider"></div>
                    </div>

                    <form className="main-booking-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group-v2">
                                <label>Full Name</label>
                                <input name="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group-v2">
                                <label>Phone Number</label>
                                <input name="phone" type="tel" placeholder="+94 XX XXX XXXX" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group-v2">
                                <label>Date</label>
                                <input name="date" type="date" value={formData.date} onChange={handleChange} required />
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
                                <input name="guests" type="number" min="1" placeholder="No. of Guests" value={formData.guests} onChange={handleChange} required />
                            </div>
                            <div className="form-group-v2">
                                <label>Selected Table</label>
                                <input
                                    name="seatingPreference"
                                    type="text"
                                    value={formData.seatingPreference || 'Please select on 360 map'}
                                    readOnly
                                    style={{ color: formData.seatingPreference ? '#ffcc00' : 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
                                />
                            </div>
                        </div>

                        {/* Interactive 360 Viewer */}
                        <div className="form-group-v2 full-width">
                            <label>Interactive 360 Table Selection</label>
                            <div className="embedded-tour-box">
                                <ReactPhotoSphereViewer
                                    src={'/360-images/scene2.jpg'} // Main Dining Scene
                                    height={'100%'}
                                    width={'100%'}
                                    plugins={[[MarkersPlugin, { markers: tableMarkers }]]}
                                    onReady={handleViewerReady}
                                />
                            </div>
                        </div>
                        <div className="form-group-v2 full-width">
                            <label>Special Instructions</label>
                            <textarea name="specialInstructions" placeholder="Allergies, special occasions, or requests..." value={formData.specialInstructions} onChange={handleChange}></textarea>
                        </div>
                        {status.message && (
                            <p style={{ color: status.type === 'success' ? '#4CAF50' : '#f44336', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                                {status.message}
                            </p>
                        )}
                        <div className="form-submit-v2">
                            <button type="submit" className="btn-confirm-v2" disabled={loading}>
                                {loading ? "Processing..." : "Confirm Reservation"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
