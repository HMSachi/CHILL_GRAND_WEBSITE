import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/components/GalleryWall.css';
import { galleryImages } from '../../data/homeData';

const GalleryWall = () => {
    const images = galleryImages;
    const [selectedIdx, setSelectedIdx] = useState(null);

    const openLightbox = (index) => {
        setSelectedIdx(index);
    };

    const closeLightbox = () => {
        setSelectedIdx(null);
    };

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedIdx !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedIdx]);

    const nextImage = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % images.length : null));
    }, [images.length]);

    const prevImage = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
    }, [images.length]);

    // Handle keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIdx === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIdx, nextImage, prevImage]);

    return (
        <section className="gallery-wall" id="gallery">
            <div className="gallery-container">
                <div className="gallery-branding">
                    <div className="branding-content">
                        <span className="gallery-badge">VIBRANT MEMORIES</span>
                        <h2 className="gallery-title">
                            MOMENTS AT THE<br /><span>CHILL GRAND</span>
                        </h2>
                        <div className="gallery-divider">
                            <span className="divider-diamond">◆</span>
                        </div>
                        <p className="gallery-description">
                            Uncover the pulse of Chill Grand through our curated lens.
                            Witness the vibrant energy, premium mixology, and eclectic
                            soul that define our House. Join the visual journey where every
                            frame captures a memory in the making.
                        </p>
                    </div>
                    <div className="branding-overlay"></div>
                </div>

                <div className="gallery-grid">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="gallery-item"
                            onClick={() => openLightbox(index)}
                        >
                            <img src={img} alt={`Gallery moment ${index + 1}`} loading="lazy" />
                            <div className="item-overlay">
                                <span className="item-zoom-icon">⤢</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedIdx !== null && (
                <div className="gallery-lightbox" onClick={closeLightbox}>
                    <div className="lightbox-backdrop"></div>
                    <button
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close image preview"
                    >
                        ✕
                    </button>

                    <button
                        className="lightbox-arrow lightbox-prev"
                        onClick={prevImage}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[selectedIdx]}
                            alt={`Chill Grand moment ${selectedIdx + 1}`}
                            className="lightbox-img"
                        />
                        <div className="lightbox-counter">
                            {selectedIdx + 1} / {images.length}
                        </div>
                    </div>

                    <button
                        className="lightbox-arrow lightbox-next"
                        onClick={nextImage}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
};

export default GalleryWall;
