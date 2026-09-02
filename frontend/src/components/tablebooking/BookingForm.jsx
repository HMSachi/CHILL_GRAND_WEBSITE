import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE_URL } from '../../config/api';
import { useLocation } from 'react-router-dom';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '../../styles/pages/TableBooking.css';
import { PLACE_360_MAP, TABLE_POSITIONS } from '../../data/place360Config';

const exitFullscreenIfActive = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.error('Exit fullscreen error:', err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
};

const getFullscreenTarget = () => {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement ||
           document.msFullscreenElement ||
           document.body;
};

const parseTimeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const clean = timeStr.trim().toUpperCase();

    // Match "14:30", "14:30:00", "02:30 PM", "02:30:00 PM", "2:30PM"
    const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/);
    if (match) {
        let hours = parseInt(match[1], 10);
        const mins = parseInt(match[2], 10);
        const period = match[3];

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + mins;
    }
    return null;
};

const isTimeOverlap = (start1, end1, start2, end2) => {
    const s1 = parseTimeToMinutes(start1);
    const e1 = parseTimeToMinutes(end1);
    const s2 = parseTimeToMinutes(start2);
    const e2 = parseTimeToMinutes(end2);

    if (s1 === null || e1 === null || s2 === null || e2 === null) return false;
    return s1 < e2 && e1 > s2;
};

const extractTimeRange = (bookingTimeStr, specialInstructionsStr = '') => {
    if (specialInstructionsStr) {
        const slotMatch = String(specialInstructionsStr).match(/\[Time Slot:\s*([^-\]]+)\s*-\s*([^\]]+)\]/i);
        if (slotMatch) {
            return { start: slotMatch[1].trim(), end: slotMatch[2].trim() };
        }
    }

    if (!bookingTimeStr) return { start: null, end: null };
    const cleanStr = String(bookingTimeStr).trim();
    const parts = cleanStr.split('-');
    if (parts.length >= 2) {
        return { start: parts[0].trim(), end: parts[1].trim() };
    } else {
        const startMins = parseTimeToMinutes(cleanStr);
        if (startMins !== null) {
            // Default 2-hour window if no end time specified
            const endMins = (startMins + 120) % (24 * 60);
            const h = Math.floor(endMins / 60);
            const m = endMins % 60;
            return {
                start: cleanStr,
                end: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            };
        }
    }
    return { start: null, end: null };
};

const createTableMarker = (id, yaw, pitch, label, tableNum, isBooked = false, lockReason = 'Already Booked') => ({
    id: `table-${id}-${label}`,
    position: { yaw, pitch },
    html: isBooked ? `
        <div class="table-marker-embedded booked" title="${tableNum} — ${lockReason}">
            <div class="marker-pulse-embedded booked"></div>
            <div class="marker-content booked">
                <span class="marker-num-txt">${tableNum || '●'}</span>
                <span class="lock-icon-inline">🔒</span>
            </div>
            <div class="booked-hover-badge">
                <span class="lock-badge-icon">🔒</span> ${lockReason}
            </div>
        </div>
    ` : `
        <div class="table-marker-embedded">
            <div class="marker-pulse-embedded"></div>
            <div class="marker-content">${tableNum || '●'}</div>
        </div>
    `,
    size: isBooked ? { width: 44, height: 44 } : { width: 40, height: 40 },
    anchor: 'center center',
    tooltip: isBooked ? `${tableNum} — ${lockReason}` : `Select ${label}`,
    data: { isTable: true, label, isBooked, tableNum, lockReason }
});

const defaultMarkers = [
    createTableMarker('1', 1.0, -0.2, 'Table #1 (4 Seats)', '#1'),
    createTableMarker('2', 2.0, -0.15, 'Table #2 (6 Seats)', '#2'),
    createTableMarker('3', 3.14, -0.1, 'VIP Table (8 Seats)', 'VIP')
];

const BookingForm = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        startTime: '',
        endTime: '',
        guests: '',
        place: '',
        seatingPreference: '',
        specialInstructions: ''
    });
    const [places, setPlaces] = useState([]);
    const [placeTables, setPlaceTables] = useState([]);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [lastClickedCoords, setLastClickedCoords] = useState(null);

    // 360 Tour Filter Bar & Reservations State
    const [filterData, setFilterData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        guests: ''
    });
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [reservations, setReservations] = useState([]);

    // Table Details Pop-up Modal State
    const [selectedTableModal, setSelectedTableModal] = useState(null);
    const [modalBookingData, setModalBookingData] = useState({
        startTime: '',
        endTime: '',
        guests: ''
    });
    const [modalError, setModalError] = useState('');

    // Successful Booking Confirmation Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successBookingData, setSuccessBookingData] = useState(null);

    // Track / Check Booking Status Modal State
    const [showLookupModal, setShowLookupModal] = useState(false);
    const [searchBookingInput, setSearchBookingInput] = useState('');
    const [lookupResult, setLookupResult] = useState(null);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState('');

    const handleLookupBooking = async (e) => {
        if (e) e.preventDefault();
        if (!searchBookingInput.trim()) return;

        setLookupLoading(true);
        setLookupError('');
        setLookupResult(null);

        const term = searchBookingInput.trim().toLowerCase().replace('#', '');

        try {
            const response = await fetch(`${API_BASE_URL}/website/reservations`);
            if (response.ok) {
                const data = await response.json();
                const list = data.reservations || [];

                const found = list.filter(r => {
                    const idStr = String(r.id || '').toLowerCase();
                    const phoneStr = String(r.phone || '').toLowerCase();
                    return idStr === term || phoneStr.includes(term);
                });

                if (found && found.length > 0) {
                    setLookupResult(found);
                } else {
                    setLookupError(`No booking found matching "${searchBookingInput}". Please verify your Booking Reference ID or Phone Number.`);
                }
            } else {
                setLookupError('Failed to retrieve reservations. Please try again later.');
            }
        } catch (err) {
            console.error('Error tracking booking:', err);
            setLookupError('Connection error. Please check your internet connection.');
        } finally {
            setLookupLoading(false);
        }
    };

    // Fetch existing reservations for date & place
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const targetDate = filterData.date || formData.date || new Date().toISOString().split('T')[0];
                const response = await fetch(`${API_BASE_URL}/website/reservations?date=${targetDate}`);
                if (response.ok) {
                    const data = await response.json();
                    setReservations(data.reservations || []);
                }
            } catch (err) {
                console.error('Failed to fetch reservations:', err);
            }
        };
        fetchReservations();
    }, [formData.place, filterData.date, formData.date]);

    // 1. Fetch available places from API
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                let response = await fetch(`${API_BASE_URL}/places`);
                if (!response.ok) {
                    response = await fetch(`${API_BASE_URL}/website/places`);
                }
                if (response.ok) {
                    const data = await response.json();
                    const placeList = Array.isArray(data) ? data : (data.places || data.data || []);
                    setPlaces(placeList);
                }
            } catch (err) {
                console.error('Failed to fetch places:', err);
            }
        };
        fetchPlaces();
    }, []);

    // 2. Fetch actual tables from Admin side when Place is selected
    useEffect(() => {
        const fetchTablesForSelectedPlace = async () => {
            if (!formData.place) {
                setPlaceTables([]);
                return;
            }

            const selectedPlaceObj = places.find(
                p => (p.place_name || p.name) === formData.place
            );

            if (!selectedPlaceObj) {
                setPlaceTables([]);
                return;
            }

            const placeId = selectedPlaceObj.place_id || selectedPlaceObj.id;

            try {
                const response = await fetch(`${API_BASE_URL}/places/${placeId}/tables`);
                if (response.ok) {
                    const data = await response.json();
                    const tablesList = Array.isArray(data) ? data : (data.tables || data.data || []);
                    setPlaceTables(tablesList);
                } else {
                    setPlaceTables([]);
                }
            } catch (err) {
                console.error('Failed to fetch tables for place:', err);
                setPlaceTables([]);
            }
        };

        fetchTablesForSelectedPlace();
        setCurrentSceneIndex(0); // Reset scene view index when place changes
    }, [formData.place, places]);

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

    const viewerRef = useRef(null);

    // Active 360 Scenes for the selected Place
    const scenes = (formData.place && PLACE_360_MAP[formData.place]) || PLACE_360_MAP['DEFAULT'];
    const currentScene = scenes[currentSceneIndex] || scenes[0];

    // Combined 360 Markers: Navigation Arrows (Street View style) + Admin Database Tables
    const activeMarkers = useMemo(() => {
        const markersList = [];

        // 1. In-Scene Google Street View style Navigation Hotspots
        if (currentScene && currentScene.hotspots && Array.isArray(currentScene.hotspots)) {
            currentScene.hotspots.forEach((hs, idx) => {
                markersList.push({
                    id: `nav-hotspot-${currentScene.id}-${hs.targetSceneId}-${idx}`,
                    position: { yaw: hs.yaw, pitch: hs.pitch },
                    html: `
                        <div class="nav-hotspot-arrow-only" title="Walk to: ${hs.label}">
                            <svg viewBox="0 0 24 24" class="arrow-head-svg">
                                <path d="M12 2L2 20l10-4 10 4L12 2z" fill="#ffcc00" stroke="#000000" stroke-width="1.2" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    `,
                    size: { width: 44, height: 44 },
                    anchor: 'center center',
                    tooltip: `Walk to: ${hs.label}`,
                    data: { isNav: true, targetSceneId: hs.targetSceneId, label: hs.label }
                });
            });
        }

        // 2. Table Markers from TABLE_POSITIONS config (supports scene-specific positions or flat place positions)
        if (formData.place && TABLE_POSITIONS[formData.place]) {
            const placeConfig = TABLE_POSITIONS[formData.place];

            // Check if coordinates are defined specifically for the current scene (e.g. "main-1", "main-2")
            let scenePositions = {};
            if (currentScene && currentScene.id && placeConfig[currentScene.id]) {
                scenePositions = placeConfig[currentScene.id];
            } else {
                scenePositions = placeConfig;
            }

            Object.entries(scenePositions).forEach(([tableKey, pos], keyIdx) => {
                if (pos && typeof pos.yaw === 'number' && typeof pos.pitch === 'number') {
                    // Smart match with DB placeTables (by exact table_id/id OR index order)
                    let matchedTable = placeTables.find(
                        t => String(t.table_id || t.id || t.table_number) === String(tableKey)
                    );

                    // If no direct table_id match, try matching by 1-based index (e.g. key "1" -> 1st table in DB)
                    if (!matchedTable && placeTables.length > 0) {
                        const numericKey = parseInt(tableKey, 10);
                        if (!isNaN(numericKey) && numericKey > 0 && numericKey <= placeTables.length) {
                            matchedTable = placeTables[numericKey - 1];
                        } else if (keyIdx < placeTables.length) {
                            matchedTable = placeTables[keyIdx];
                        }
                    }

                    // Extract actual table ID & seat count from DB table record
                    const actualTableId = matchedTable
                        ? (matchedTable.table_id || matchedTable.id || matchedTable.table_number || tableKey)
                        : tableKey;

                    const displayNum = String(actualTableId).startsWith('#') ? actualTableId : `#${actualTableId}`;
                    const seats = matchedTable ? (matchedTable.seats || matchedTable.capacity || 4) : (pos.seats || 4);

                    // Find reservations matching this specific table
                    const tableReservations = reservations.filter(r => {
                        if (!r.seating_preference) return false;
                        const pref = String(r.seating_preference);
                        const tid = String(actualTableId);
                        return (
                            pref.includes(`#${tid}`) ||
                            pref.includes(`Table ${tid}`) ||
                            pref.includes(`Table #${tid}`)
                        );
                    });

                    // Evaluate availability based on active filter or general bookings
                    let isBooked = false;
                    let lockReason = 'Already Booked';

                    if (isFilterActive) {
                        // Check guest capacity
                        const capacityOk = filterData.guests ? seats >= parseInt(filterData.guests, 10) : true;

                        // Check time range overlap
                        let timeConflict = false;
                        if (filterData.startTime && filterData.endTime) {
                            timeConflict = tableReservations.some(r => {
                                if (r.status && String(r.status).toLowerCase() === 'cancelled') return false;
                                const { start, end } = extractTimeRange(r.booking_time, r.special_instructions);
                                return isTimeOverlap(filterData.startTime, filterData.endTime, start, end);
                            });
                        }

                        if (!capacityOk) {
                            isBooked = true;
                            lockReason = `Exceeds Capacity (Max ${seats} Guests)`;
                        } else if (timeConflict) {
                            isBooked = true;
                            lockReason = `Booked for requested time`;
                        } else if (Boolean(pos.is_booked)) {
                            isBooked = true;
                            lockReason = `Already Booked`;
                        }
                    } else {
                        isBooked = Boolean(
                            (matchedTable && (
                                matchedTable.is_booked ||
                                matchedTable.isBooked ||
                                (matchedTable.status && String(matchedTable.status).toUpperCase() !== 'AVAILABLE')
                            )) ||
                            pos.isBooked ||
                            pos.is_booked
                        );

                        if (isBooked) {
                            lockReason = matchedTable?.hasActiveOrder ? 'Currently Occupied' : 'Already Booked';
                        }
                    }

                    const label = matchedTable
                        ? `${matchedTable.table_name || `Table ${displayNum}`} (${seats} Seats)`
                        : `Table ${displayNum} (${seats} Seats)`;

                    const markerObj = createTableMarker(actualTableId, pos.yaw, pos.pitch, label, displayNum, isBooked, lockReason);
                    // Pass extended metadata for popup modal
                    markerObj.data = {
                        ...markerObj.data,
                        actualTableId,
                        displayNum,
                        label,
                        seats,
                        lockReason,
                        tableReservations
                    };

                    markersList.push(markerObj);
                }
            });
        }

        return markersList;
    }, [currentScene, placeTables, formData.place, isFilterActive, filterData, reservations]);

    const activeMarkersRef = useRef(activeMarkers);
    useEffect(() => {
        activeMarkersRef.current = activeMarkers;
        if (viewerRef.current) {
            const markersPlugin = viewerRef.current.getPlugin(MarkersPlugin);
            if (markersPlugin && activeMarkers) {
                try {
                    markersPlugin.setMarkers(activeMarkers);
                } catch (e) {
                    // Ignore transient marker set during scene transition
                }
            }
        }
    }, [activeMarkers]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleViewerReady = (instance) => {
        viewerRef.current = instance;
        const markersPlugin = instance.getPlugin(MarkersPlugin);

        if (markersPlugin) {
            markersPlugin.addEventListener('select-marker', ({ marker }) => {
                if (marker.data?.isNav && marker.data?.targetSceneId) {
                    // Navigate to connected 360 scene (Google Street View style navigation)
                    const targetIdx = scenes.findIndex(s => s.id === marker.data.targetSceneId);
                    if (targetIdx !== -1) {
                        setCurrentSceneIndex(targetIdx);
                    }
                } else if (marker.data?.isTable) {
                    // Open Table Details Pop-up Modal on table click
                    setSelectedTableModal({
                        id: marker.data.actualTableId,
                        displayNum: marker.data.displayNum || marker.data.tableNum,
                        label: marker.data.label,
                        seats: marker.data.seats || 4,
                        isBooked: marker.data.isBooked,
                        lockReason: marker.data.lockReason || 'Already Booked',
                        reservations: marker.data.tableReservations || []
                    });
                    setModalBookingData({
                        startTime: filterData.startTime || formData.startTime || '',
                        endTime: filterData.endTime || formData.endTime || '',
                        guests: filterData.guests || formData.guests || ''
                    });
                    setModalError('');
                }
            });
        }

        // Click-to-Get-Coordinates feature for manual pin placement
        instance.addEventListener('click', ({ data }) => {
            if (data && typeof data.yaw === 'number' && typeof data.pitch === 'number') {
                const yaw = Number(data.yaw.toFixed(2));
                const pitch = Number(data.pitch.toFixed(2));
                setLastClickedCoords({ yaw, pitch });
            }
        });

        // When panorama finishes loading, update markers and hide loader
        instance.addEventListener('panorama-loaded', () => {
            if (markersPlugin && activeMarkersRef.current) {
                try {
                    markersPlugin.setMarkers(activeMarkersRef.current);
                } catch (e) {
                    console.error('Error applying markers on panorama load:', e);
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const targetDate = formData.date || filterData.date || new Date().toISOString().split('T')[0];
        const targetTable = formData.seatingPreference || '';

        // Validate time slot overlap on main form submit
        if (formData.startTime && formData.endTime && targetTable) {
            const overlapRes = reservations.find(r => {
                if (r.status && String(r.status).toLowerCase() === 'cancelled') return false;
                if (r.booking_date !== targetDate) return false;

                const pref = String(r.seating_preference || '');
                const tTarget = String(targetTable);
                const isSameTable = pref.includes(tTarget) || tTarget.includes(pref);
                if (!isSameTable) return false;

                const { start, end } = extractTimeRange(r.booking_time, r.special_instructions);
                return isTimeOverlap(formData.startTime, formData.endTime, start, end);
            });

            if (overlapRes) {
                const { start: cStart, end: cEnd } = extractTimeRange(overlapRes.booking_time, overlapRes.special_instructions);
                const timeText = cStart && cEnd ? `${cStart} - ${cEnd}` : (overlapRes.booking_time || 'existing booking');
                setStatus({
                    type: 'error',
                    message: `❌ Cannot confirm reservation: Table is already booked for the selected time slot (${timeText}) on ${targetDate}. Please choose another time or table.`
                });
                setLoading(false);
                return;
            }
        }

        const timeString = formData.startTime && formData.endTime
            ? `${formData.startTime} - ${formData.endTime}`
            : (formData.startTime || formData.endTime || '');

        const payload = {
            ...formData,
            time: timeString
        };

        try {
            const response = await fetch(`${API_BASE_URL}/website/reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                const createdRecord = data.data || {
                    id: data.id || Math.floor(100 + Math.random() * 900),
                    name: payload.name,
                    phone: payload.phone,
                    booking_date: targetDate,
                    booking_time: timeString,
                    seating_preference: payload.seatingPreference,
                    guests: payload.guests || 1,
                    special_instructions: payload.specialInstructions,
                    status: 'pending'
                };

                setSuccessBookingData(createdRecord);
                setShowSuccessModal(true);

                setStatus({ type: 'success', message: `🎉 Reservation submitted successfully! Reference ID: #${createdRecord.id}` });
                setFormData({ name: '', phone: '', date: '', startTime: '', endTime: '', guests: '', place: '', seatingPreference: '', specialInstructions: '' });
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
                    <div className="form-header-v2" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <span className="subtitle">Secure Your Spot</span>
                            <h2 className="title" style={{ margin: 0 }}>Reservation Details</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchBookingInput('');
                                setLookupResult(null);
                                setLookupError('');
                                setShowLookupModal(true);
                            }}
                            className="btn-check-booking-status"
                        >
                            <span>🔎 Check Your Booking Status</span>
                        </button>
                        <div className="divider" style={{ width: '100%', marginTop: '10px' }}></div>
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
                            <div className="form-group-v2 span-2">
                                <label>Select Place / Section</label>
                                <select
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Place / Section --</option>
                                    {places.map((p) => (
                                        <option key={p.place_id || p.id} value={p.place_name || p.name}>
                                            {p.place_name || p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group-v2">
                                <label style={{ color: formData.seatingPreference ? '#4CAF50' : 'inherit' }}>
                                    {formData.seatingPreference ? '✅ Table Reserved' : 'Selected Table & Schedule'}
                                </label>
                                <input
                                    name="seatingPreference"
                                    type="text"
                                    placeholder="Please select on 360 map"
                                    value={
                                        formData.seatingPreference
                                            ? `${formData.seatingPreference}${formData.startTime && formData.endTime ? ` [${formData.startTime} - ${formData.endTime}]` : ''}${formData.guests ? ` (${formData.guests} Guests)` : ''}`
                                            : ''
                                    }
                                    onChange={handleChange}
                                    readOnly
                                    style={{ color: formData.seatingPreference ? '#ffcc00' : 'rgba(255,255,255,0.4)', fontWeight: 'bold', cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        {/* Interactive 360 Viewer with Filter Bar, Hotspots & Table Pop-up Modal */}
                        <div className="form-group-v2 full-width">
                            <label>
                                Interactive 360 Virtual Tour {formData.place ? `— ${formData.place}` : ''}
                            </label>

                            {/* 360 TOUR FILTER BAR */}
                            <div className="tour-filter-bar">
                                <div className="filter-title-box">
                                    <span className="filter-icon">🔍</span>
                                    <span className="filter-heading">Find Available Table</span>
                                </div>
                                <div className="filter-inputs-grid">
                                    <div className="filter-field">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            value={filterData.date}
                                            onChange={(e) => setFilterData(prev => ({ ...prev, date: e.target.value }))}
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Start Time</label>
                                        <input
                                            type="time"
                                            value={filterData.startTime}
                                            onChange={(e) => setFilterData(prev => ({ ...prev, startTime: e.target.value }))}
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>End Time</label>
                                        <input
                                            type="time"
                                            value={filterData.endTime}
                                            onChange={(e) => setFilterData(prev => ({ ...prev, endTime: e.target.value }))}
                                        />
                                    </div>
                                    <div className="filter-field">
                                        <label>Guests</label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="No. of Guests"
                                            value={filterData.guests}
                                            onChange={(e) => setFilterData(prev => ({ ...prev, guests: e.target.value }))}
                                        />
                                    </div>
                                    <div className="filter-action-btns">
                                        <button
                                            type="button"
                                            className="btn-filter-apply"
                                            onClick={() => {
                                                setIsFilterActive(true);
                                                if (filterData.date) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        date: filterData.date,
                                                        startTime: filterData.startTime || prev.startTime,
                                                        endTime: filterData.endTime || prev.endTime,
                                                        guests: filterData.guests || prev.guests
                                                    }));
                                                }
                                            }}
                                        >
                                            Filter Tables
                                        </button>
                                        {isFilterActive && (
                                            <button
                                                type="button"
                                                className="btn-filter-clear"
                                                onClick={() => {
                                                    setIsFilterActive(false);
                                                    setFilterData({
                                                        date: new Date().toISOString().split('T')[0],
                                                        startTime: '',
                                                        endTime: '',
                                                        guests: ''
                                                    });
                                                }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="embedded-tour-container">
                                {scenes.length > 1 && (
                                    <div className="scene-navigation-overlay">
                                        <button
                                            type="button"
                                            className="scene-nav-btn prev"
                                            onClick={() => setCurrentSceneIndex(prev => (prev === 0 ? scenes.length - 1 : prev - 1))}
                                            title="Previous View"
                                        >
                                            &#10094;
                                        </button>

                                        <div className="scene-info-badge">
                                            <span className="scene-counter">Location {currentSceneIndex + 1} of {scenes.length}</span>
                                            <span className="scene-title">{currentScene.title || 'Panorama View'}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="scene-nav-btn next"
                                            onClick={() => setCurrentSceneIndex(prev => (prev === scenes.length - 1 ? 0 : prev + 1))}
                                            title="Next View"
                                        >
                                            &#10095;
                                        </button>
                                    </div>
                                )}

                                <div className="embedded-tour-box">
                                    <ReactPhotoSphereViewer
                                        key={formData.place || 'default'}
                                        src={currentScene.image}
                                        height={'100%'}
                                        width={'100%'}
                                        plugins={[[MarkersPlugin, { markers: activeMarkers }]]}
                                        onReady={handleViewerReady}
                                    />
                                </div>

                                {lastClickedCoords && (
                                    <div className="coords-picker-badge">
                                        <span>📍 Clicked Point: <strong>yaw: {lastClickedCoords.yaw}, pitch: {lastClickedCoords.pitch}</strong></span>
                                        <button
                                            type="button"
                                            className="btn-copy-coords"
                                            onClick={() => {
                                                const snippet = `{ yaw: ${lastClickedCoords.yaw}, pitch: ${lastClickedCoords.pitch} }`;
                                                navigator.clipboard.writeText(snippet);
                                                alert(`Copied coordinates to clipboard!\n${snippet}`);
                                            }}
                                        >
                                            📋 Copy Coords
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BOOKING DETAILS SECTION (Appears when table/schedule is selected) */}
                        {formData.seatingPreference && (
                            <div className="form-group-v2 full-width booking-details-summary-card">
                                <div className="summary-header-row">
                                    <span className="summary-icon">📋</span>
                                    <h4 className="summary-title">Booking Details Summary</h4>
                                </div>
                                <div className="summary-details-grid">
                                    <div className="summary-detail-item">
                                        <span className="detail-label">Table Reserved</span>
                                        <span className="detail-value yellow">{formData.seatingPreference}</span>
                                    </div>
                                    <div className="summary-detail-item">
                                        <span className="detail-label">Reservation Date</span>
                                        <span className="detail-value">{formData.date || filterData.date || 'Today'}</span>
                                    </div>
                                    <div className="summary-detail-item">
                                        <span className="detail-label">Booking Time</span>
                                        <span className="detail-value yellow">
                                            {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'Time selected'}
                                        </span>
                                    </div>
                                    <div className="summary-detail-item">
                                        <span className="detail-label">Guests Count</span>
                                        <span className="detail-value">🪑 {formData.guests || '1'} Guests</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-group-v2 full-width">
                            <label>Any Special Requests?</label>
                            <textarea name="specialInstructions" placeholder="Please mention any special requests or preferences here..." value={formData.specialInstructions} onChange={handleChange}></textarea>
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

            {/* TABLE DETAILS POPUP MODAL */}
            {selectedTableModal && createPortal(
                <div className="table-modal-overlay" onClick={() => { setSelectedTableModal(null); exitFullscreenIfActive(); }}>
                    <div className="table-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn-close-table-modal"
                            onClick={() => { setSelectedTableModal(null); exitFullscreenIfActive(); }}
                        >
                            &times;
                        </button>

                        <div className="table-modal-header">
                            <span className="modal-subtitle">Table Schedule & Booking</span>
                            <h3 className="modal-title">
                                {selectedTableModal.label || `Table ${selectedTableModal.displayNum}`}
                            </h3>
                            <div className="modal-badges-row">
                                <span className="modal-badge capacity">
                                    🪑 {selectedTableModal.seats} Seats Capacity
                                </span>
                                {selectedTableModal.isBooked ? (
                                    <span className="modal-badge booked">
                                        🔒 {selectedTableModal.lockReason || 'Already Booked'}
                                    </span>
                                ) : (
                                    <span className="modal-badge available">
                                        ✅ Available
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="table-modal-body">
                            {/* EXISTING BOOKED TIME SLOTS LIST */}
                            <div className="booked-slots-section">
                                <h4 className="slots-section-title">
                                    📅 Existing Bookings for {filterData.date || 'Selected Date'}
                                </h4>
                                {selectedTableModal.reservations && selectedTableModal.reservations.length > 0 ? (
                                    <div className="time-slots-list">
                                        {selectedTableModal.reservations.map((res, idx) => (
                                            <div key={idx} className="time-slot-item booked">
                                                <span className="slot-icon">🔒</span>
                                                <div className="slot-details">
                                                    <span className="slot-time">{res.booking_time || 'Booked Slot'}</span>
                                                    <span className="slot-status">Reserved ({res.guests || 2} Guests)</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-slots-box">
                                        <span>✨ No existing bookings for this table on this date. Table is fully open!</span>
                                    </div>
                                )}
                            </div>

                            {/* BOOK THIS TABLE FORM */}
                            <div className="modal-booking-box">
                                <h4 className="slots-section-title">⚡ Book Table {selectedTableModal.displayNum}</h4>
                                {(() => {
                                    const getModalValidationError = () => {
                                        const { startTime, endTime, guests } = modalBookingData;
                                        const maxSeats = selectedTableModal.seats || 4;

                                        if (guests && parseInt(guests, 10) > maxSeats) {
                                            return `Cannot book: Guest count (${guests}) exceeds table capacity (${maxSeats} Seats).`;
                                        }

                                        if (startTime && endTime) {
                                            const overlapConf = (selectedTableModal.reservations || []).find(r => {
                                                if (r.status && String(r.status).toLowerCase() === 'cancelled') return false;
                                                const { start, end } = extractTimeRange(r.booking_time, r.special_instructions);
                                                return isTimeOverlap(startTime, endTime, start, end);
                                            });

                                            if (overlapConf) {
                                                const { start: confStart, end: confEnd } = extractTimeRange(overlapConf.booking_time, overlapConf.special_instructions);
                                                const timeDisplay = confStart && confEnd ? `${confStart} - ${confEnd}` : (overlapConf.booking_time || 'existing booking');
                                                return `Cannot book: Selected time slot (${startTime} - ${endTime}) overlaps with an existing booking (${timeDisplay}) on this table.`;
                                            }
                                        }

                                        return null;
                                    };

                                    const activeModalError = modalError || getModalValidationError();
                                    const isGuestsError = modalBookingData.guests && parseInt(modalBookingData.guests, 10) > (selectedTableModal.seats || 4);
                                    const isTimeError = Boolean(activeModalError && activeModalError.includes('time slot'));

                                    return (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (activeModalError) return;

                                                const { startTime, endTime, guests } = modalBookingData;
                                                if (!startTime || !endTime || !guests) {
                                                    setModalError('Please specify Start Time, End Time, and Number of Guests.');
                                                    return;
                                                }

                                                const bookingDate = filterData.date || formData.date || new Date().toISOString().split('T')[0];
                                                const bookingTimeStr = `${startTime} - ${endTime}`;

                                                // Auto-fill main reservation form without sending API request
                                                setFormData(prev => ({
                                                    ...prev,
                                                    date: bookingDate,
                                                    startTime: startTime,
                                                    endTime: endTime,
                                                    guests: guests,
                                                    seatingPreference: selectedTableModal.label
                                                }));

                                                setStatus({
                                                    type: 'success',
                                                    message: `🎉 Table ${selectedTableModal.displayNum} selected for ${bookingTimeStr}! Please enter your Name & Phone Number below, then click Confirm Reservation.`
                                                });

                                                // Close modal & exit 360 fullscreen mode back to normal screen view
                                                setSelectedTableModal(null);
                                                exitFullscreenIfActive();
                                            }}
                                        >
                                            <div className="modal-fields-grid">
                                                <div className="modal-field">
                                                    <label>Start Time</label>
                                                    <input
                                                        type="time"
                                                        required
                                                        className={isTimeError ? 'input-error' : ''}
                                                        value={modalBookingData.startTime}
                                                        onChange={(e) => {
                                                            setModalError('');
                                                            setModalBookingData(prev => ({ ...prev, startTime: e.target.value }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="modal-field">
                                                    <label>End Time</label>
                                                    <input
                                                        type="time"
                                                        required
                                                        className={isTimeError ? 'input-error' : ''}
                                                        value={modalBookingData.endTime}
                                                        onChange={(e) => {
                                                            setModalError('');
                                                            setModalBookingData(prev => ({ ...prev, endTime: e.target.value }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="modal-field">
                                                    <label>Guests</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        required
                                                        placeholder={`Max ${selectedTableModal.seats}`}
                                                        className={isGuestsError ? 'input-error' : ''}
                                                        value={modalBookingData.guests}
                                                        onChange={(e) => {
                                                            setModalError('');
                                                            setModalBookingData(prev => ({ ...prev, guests: e.target.value }));
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {activeModalError && (
                                                <div className="modal-error-alert">
                                                    <span className="error-icon">⚠️</span>
                                                    <span className="error-text">{activeModalError}</span>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className={`btn-modal-book-now ${activeModalError ? 'disabled' : ''}`}
                                                disabled={Boolean(activeModalError)}
                                            >
                                                {activeModalError ? 'Cannot Book - Check Reason Above' : 'Book This Table'}
                                            </button>
                                        </form>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>,
                getFullscreenTarget()
            )}

            {/* 1. SUCCESSFUL BOOKING CONFIRMATION POPUP MODAL */}
            {showSuccessModal && successBookingData && createPortal(
                <div className="success-booking-modal-overlay" onClick={() => { setShowSuccessModal(false); exitFullscreenIfActive(); }}>
                    <div className="success-booking-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-luxury">
                            <div>
                                <span className="gold-tag">✨ Official Confirmation</span>
                                <h3>Reservation Submitted Successfully</h3>
                            </div>
                            <button
                                type="button"
                                className="btn-close-modal-luxury"
                                onClick={() => { setShowSuccessModal(false); exitFullscreenIfActive(); }}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body-luxury">
                            {/* Official Booking Reference ID Pass */}
                            <div className="booking-reference-badge">
                                <span className="ref-label">Official Booking Reference ID</span>
                                <span className="ref-id-number">#{successBookingData.id}</span>
                            </div>

                            {/* Details Grid */}
                            <div className="summary-details-grid">
                                <div className="summary-detail-item">
                                    <span className="detail-label">Customer Name</span>
                                    <span className="detail-value">{successBookingData.name || 'N/A'}</span>
                                </div>
                                <div className="summary-detail-item">
                                    <span className="detail-label">Phone Number</span>
                                    <span className="detail-value yellow">{successBookingData.phone || 'N/A'}</span>
                                </div>
                                <div className="summary-detail-item">
                                    <span className="detail-label">Booking Date</span>
                                    <span className="detail-value">📅 {successBookingData.booking_date || successBookingData.date}</span>
                                </div>
                                <div className="summary-detail-item">
                                    <span className="detail-label">Time Slot</span>
                                    <span className="detail-value yellow">⏰ {successBookingData.booking_time || successBookingData.time}</span>
                                </div>
                                <div className="summary-detail-item">
                                    <span className="detail-label">Reserved Table / Place</span>
                                    <span className="detail-value yellow">{successBookingData.seating_preference || successBookingData.place || 'General Table'}</span>
                                </div>
                                <div className="summary-detail-item">
                                    <span className="detail-label">Guest Count</span>
                                    <span className="detail-value">🪑 {successBookingData.guests} Guests</span>
                                </div>
                                <div className="summary-detail-item" style={{ gridColumn: 'span 2' }}>
                                    <span className="detail-label">Current Status</span>
                                    <span className="detail-value yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffcc00', display: 'inline-block' }}></span>
                                        {successBookingData.status ? String(successBookingData.status).toUpperCase() : 'PENDING CONFIRMATION'}
                                    </span>
                                </div>
                            </div>

                            {/* Official Contact Desk Info */}
                            <div className="official-contact-box">
                                <h4>📞 Reservations Desk Contact Info</h4>
                                <p>Please save your <strong>Booking Reference ID (#{successBookingData.id})</strong>. You can check your live status anytime on our website or contact our desk:</p>
                                <div className="contact-pills-row">
                                    <div className="contact-pill-item">📞 Hotline: +94 77 860 2218</div>
                                    <div className="contact-pill-item">☎️ Desk: +94 11 234 5678</div>
                                </div>
                                <p className="contact-hours-note">⏰ Reservations Desk Hours: 10:00 AM - 11:00 PM (Daily)</p>
                            </div>
                        </div>

                        <div className="modal-footer-luxury">
                            <button
                                type="button"
                                className="btn-luxury-secondary"
                                onClick={() => window.print()}
                            >
                                🖨️ Print Receipt
                            </button>
                            <button
                                type="button"
                                className="btn-luxury-primary"
                                onClick={() => { setShowSuccessModal(false); exitFullscreenIfActive(); }}
                            >
                                Done & Close
                            </button>
                        </div>
                    </div>
                </div>,
                getFullscreenTarget()
            )}

            {/* 2. CHECK YOUR BOOKING STATUS MODAL */}
            {showLookupModal && createPortal(
                <div className="lookup-modal-overlay" onClick={() => setShowLookupModal(false)}>
                    <div className="lookup-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-luxury">
                            <div>
                                <span className="gold-tag">🔎 Booking Tracker</span>
                                <h3>Check Your Reservation Status</h3>
                            </div>
                            <button
                                type="button"
                                className="btn-close-modal-luxury"
                                onClick={() => setShowLookupModal(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body-luxury">
                            {/* Search Bar Input Form */}
                            <form onSubmit={handleLookupBooking} style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#e5c158', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                    Enter Booking Reference ID or Registered Phone Number
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. #9 or 0778602218..."
                                        value={searchBookingInput}
                                        onChange={(e) => setSearchBookingInput(e.target.value)}
                                        style={{ flex: 1, padding: '12px 16px', background: '#202020', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={lookupLoading}
                                        className="btn-luxury-primary"
                                        style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}
                                    >
                                        {lookupLoading ? 'Searching...' : '🔍 Track Status'}
                                    </button>
                                </div>
                            </form>

                            {/* Error Message */}
                            {lookupError && (
                                <div className="modal-error-alert" style={{ marginTop: '10px' }}>
                                    <span className="error-icon">⚠️</span>
                                    <span className="error-text">{lookupError}</span>
                                </div>
                            )}

                            {/* Search Results Display */}
                            {lookupResult && lookupResult.length > 0 && (
                                <div style={{ spaceY: '16px' }}>
                                    {lookupResult.map((resItem) => {
                                        const bStatus = String(resItem.status || 'booked').toLowerCase();
                                        const isAccepted = bStatus === 'accepted' || bStatus === 'confirmed';
                                        const isCancelled = bStatus === 'cancelled';

                                        return (
                                            <div key={resItem.id} style={{ background: '#1c1c1c', border: `1px solid ${isAccepted ? '#4CAF50' : isCancelled ? '#ff4d4d' : '#ffcc00'}`, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                                {/* Reference & Status Badge */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Booking Reference</span>
                                                        <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#e5c158', margin: 0 }}>#{resItem.id}</h4>
                                                    </div>
                                                    <span style={{
                                                        padding: '6px 14px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        background: isAccepted ? 'rgba(76, 175, 80, 0.2)' : isCancelled ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255, 204, 0, 0.2)',
                                                        color: isAccepted ? '#4CAF50' : isCancelled ? '#ff4d4d' : '#ffcc00',
                                                        border: `1px solid ${isAccepted ? '#4CAF50' : isCancelled ? '#ff4d4d' : '#ffcc00'}`
                                                    }}>
                                                        {isAccepted ? '✅ ACCEPTED' : isCancelled ? '❌ CANCELLED' : '⏳ BOOKED / PENDING'}
                                                    </span>
                                                </div>

                                                {/* Booking Details Grid */}
                                                <div className="summary-details-grid">
                                                    <div className="summary-detail-item">
                                                        <span className="detail-label">Customer Name</span>
                                                        <span className="detail-value">{resItem.name || 'N/A'}</span>
                                                    </div>
                                                    <div className="summary-detail-item">
                                                        <span className="detail-label">Phone Number</span>
                                                        <span className="detail-value yellow">{resItem.phone || 'N/A'}</span>
                                                    </div>
                                                    <div className="summary-detail-item">
                                                        <span className="detail-label">Booking Date</span>
                                                        <span className="detail-value">📅 {resItem.booking_date}</span>
                                                    </div>
                                                    <div className="summary-detail-item">
                                                        <span className="detail-label">Time Slot</span>
                                                        <span className="detail-value yellow">⏰ {resItem.booking_time}</span>
                                                    </div>
                                                    <div className="summary-detail-item" style={{ gridColumn: 'span 2' }}>
                                                        <span className="detail-label">Reserved Table / Section</span>
                                                        <span className="detail-value yellow">{resItem.seating_preference || 'General Dining Table'}</span>
                                                    </div>
                                                    <div className="summary-detail-item">
                                                        <span className="detail-label">Guests Count</span>
                                                        <span className="detail-value">🪑 {resItem.guests} Guests</span>
                                                    </div>
                                                    <div className="summary-detail-item">
                                                        <span className="detail-label">Created At</span>
                                                        <span className="detail-value">{resItem.created_at ? new Date(resItem.created_at).toLocaleDateString() : 'Today'}</span>
                                                    </div>
                                                </div>

                                                {resItem.special_instructions && (
                                                    <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic' }}>
                                                        <span>Note: {resItem.special_instructions}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Official Contact Desk Info */}
                            <div className="official-contact-box">
                                <h4>📞 Contact Reservations Desk for Inquiries</h4>
                                <p>If you have any questions, need to make changes, or want to verify your table booking status directly, please contact our team:</p>
                                <div className="contact-pills-row">
                                    <div className="contact-pill-item">📞 Hotline: +94 77 860 2218</div>
                                    <div className="contact-pill-item">☎️ Desk: +94 11 234 5678</div>
                                </div>
                                <p className="contact-hours-note">⏰ Reservations Desk Hours: 10:00 AM - 11:00 PM (Daily)</p>
                            </div>
                        </div>

                        <div className="modal-footer-luxury">
                            <button
                                type="button"
                                className="btn-luxury-secondary"
                                onClick={() => setShowLookupModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                getFullscreenTarget()
            )}
        </section>
    );
};

export default BookingForm;
