import React, { useState } from 'react';
import './Events.css';

import happeningsData from '../dummy/happening/happeningsData';

const galleryItems = happeningsData;

const Events = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="happenings-page">
            <div className="container">
                <div className="happenings-header">
                    <h4 className="page-subtitle">What's On</h4>
                    <h1 className="page-title">Happenings</h1>
                    <p className="page-description">Discover our latest promotions, upcoming events, and exclusive offers.</p>
                </div>

                <div className="masonry-gallery">
                    {galleryItems.map(item => (
                        <div key={item.id} className="masonry-item" onClick={() => setSelectedItem(item)}>
                            <div className="poster-wrapper">
                                <img src={item.img} alt={item.title} className="poster-img" />
                                <div className="poster-overlay">
                                    <span className="poster-tag">{item.tag}</span>
                                    <h3 className="poster-title">{item.title}</h3>
                                    <button className="btn-view-poster">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Lightbox Modal */}
            {selectedItem && (
                <div className="lightbox-modal" onClick={() => setSelectedItem(null)}>
                    <div className="lightbox-content-detailed" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setSelectedItem(null)}>×</button>
                        
                        <div className="lightbox-grid">
                            <div className="lightbox-img-col">
                                <img src={selectedItem.img} alt={selectedItem.title} />
                            </div>
                            <div className="lightbox-text-col">
                                <span className="modal-tag">{selectedItem.tag}</span>
                                <h2 className="modal-title">{selectedItem.title}</h2>
                                <p className="modal-desc">{selectedItem.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
