import React from 'react';
import '../../styles/components/GalleryWall.css';
import { galleryImages } from '../../data/homeData';

const GalleryWall = () => {
    // Array of images for the grid
    const images = galleryImages;

    return (
        <section className="gallery-wall" id="gallery">
            <div className="gallery-container">
                <div className="gallery-branding">
                    <div className="branding-content">
                        <h2 className="gallery-title">MOMENTS AT THE<br /><span>CHILL GRAND</span></h2>
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
                        <div key={index} className="gallery-item">
                            <img src={img} alt={`Gallery moment ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryWall;
