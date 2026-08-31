import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import { useNavigate } from 'react-router-dom';

const exitFullscreenIfActive = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
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

const SCENES = {
    entrance: {
        panorama: '/360-images/scene1.jpeg',
        markers: [
            {
                id: 'nav-inside',
                position: { yaw: 0.5, pitch: -0.1 },
                html: '<div style="font-size: 40px; color: #fff; text-shadow: 0px 0px 5px #000; cursor: pointer;">⬆️</div>',
                anchor: 'center',
                size: { width: 40, height: 40 },
                tooltip: 'Go Inside'
            }
        ]
    },
    inside: {
        panorama: '/360-images/scene2.jpg',
        markers: [
            {
                id: 'nav-entrance',
                position: { yaw: 3.14, pitch: -0.1 },
                html: '<div style="font-size: 40px; color: #fff; text-shadow: 0px 0px 5px #000; cursor: pointer;">⬇️</div>',
                anchor: 'center',
                size: { width: 40, height: 40 },
                tooltip: 'Go back to Entrance'
            },
            {
                id: 'table-1',
                position: { yaw: 1.0, pitch: -0.2 },
                html: '<div style="font-size: 32px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0px 0px 10px #000; cursor: pointer;">🍽️</div>',
                size: { width: 40, height: 40 },
                anchor: 'bottom center',
                tooltip: 'Book Table 1'
            },
            {
                id: 'table-2',
                position: { yaw: 2.0, pitch: -0.2 },
                html: '<div style="font-size: 32px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0px 0px 10px #000; cursor: pointer;">🍽️</div>',
                size: { width: 40, height: 40 },
                anchor: 'bottom center',
                tooltip: 'Book Table 2'
            }
        ]
    }
};

const VirtualTour = () => {
    const psvRef = useRef(null);
    const navigate = useNavigate();
    const [currentScene, setCurrentScene] = useState('entrance');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const handleReady = (instance) => {
        psvRef.current = instance;
        const markersPlugin = instance.getPlugin(MarkersPlugin);

        markersPlugin.addEventListener('select-marker', ({ marker }) => {
            if (marker.id.startsWith('nav-')) {
                const nextScene = marker.id.split('-')[1];
                setCurrentScene(nextScene);
            } else if (marker.id.startsWith('table-')) {
                const tableId = marker.id.split('-')[1];
                setSelectedTable(tableId);
                setIsPopupOpen(true);
            }
        });
    };

    // Update viewer when scene changes
    useEffect(() => {
        if (psvRef.current) {
            setTimeout(() => {
                const markersPlugin = psvRef.current.getPlugin(MarkersPlugin);
                if (markersPlugin) {
                    markersPlugin.clearMarkers();
                    markersPlugin.setMarkers(SCENES[currentScene].markers);
                }
            }, 500);
        }
    }, [currentScene]);

    const handleConfirmBooking = () => {
        setIsPopupOpen(false);
        exitFullscreenIfActive();
        navigate(`/table-booking?tableId=${selectedTable}`);
    };

    const handleCancelOptions = () => {
        setIsPopupOpen(false);
        setSelectedTable(null);
        exitFullscreenIfActive();
    };

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 80px)', position: 'relative' }}>
            <ReactPhotoSphereViewer
                src={SCENES[currentScene].panorama}
                height={'100%'}
                width={'100%'}
                plugins={[[MarkersPlugin, { markers: SCENES[currentScene].markers }]]}
                onReady={handleReady}
            />

            {isPopupOpen && createPortal(
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: '#141414', border: '1px solid #e5c158', padding: '28px', borderRadius: '16px', zIndex: 999999,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.9)', textAlign: 'center', color: '#fff', minWidth: '320px'
                }}>
                    <h3 style={{ color: '#e5c158', marginBottom: '12px', fontSize: '1.4rem' }}>Book Table {selectedTable}?</h3>
                    <p style={{ color: '#ccc', marginBottom: '24px', fontSize: '0.9rem' }}>Would you like to proceed and book this table?</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={handleCancelOptions} style={{
                            padding: '10px 20px', border: '1px solid #666', background: 'transparent',
                            borderRadius: '8px', cursor: 'pointer', color: '#ccc', fontWeight: 'bold'
                        }}>Cancel</button>
                        <button onClick={handleConfirmBooking} style={{
                            padding: '10px 24px', border: 'none', background: '#e5c158',
                            borderRadius: '8px', cursor: 'pointer', color: '#000', fontWeight: '900'
                        }}>Confirm Booking</button>
                    </div>
                </div>,
                getFullscreenTarget()
            )}
        </div>
    );
};

export default VirtualTour;
