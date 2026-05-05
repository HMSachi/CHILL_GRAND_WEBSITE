import React from 'react';
import '../../styles/components/GalleryWall.css';

// Import images
import bar1 from '../../assets/bar.jpg';
import bar2 from '../../assets/bar2.jpg';
import dj from '../../assets/dj.jpg';
import private_dining from '../../assets/private_dining.jpg';
import restaurants from '../../assets/restaurants.jpg';
import cocktail from '../../assets/cocktail.jpg';
import food from '../../assets/food.jpg';
import back from '../../assets/back.jpg';
import bg from '../../assets/bg.jpg';
import beef from '../../assets/beef.jpg';
import starters from '../../assets/starters.jpg';
import soup from '../../assets/soup.jpg';

const GalleryWall = () => {
    // Array of images for the grid (repeating for density)
    const images = [
        bar1, dj, bar2, private_dining, restaurants, cocktail,
        food, back, starters, beef, soup, bg,
        dj, bar1, cocktail, restaurants, private_dining, bar2,
        soup, beef, food, starters, back, bar1
    ];

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
