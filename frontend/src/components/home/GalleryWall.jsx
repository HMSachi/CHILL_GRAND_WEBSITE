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

// Import moments images
import m1 from '../../assets/moments/m1.png';
import m2 from '../../assets/moments/m2.png';
import m3 from '../../assets/moments/m3.png';
import m4 from '../../assets/moments/m4.png';
import m5 from '../../assets/moments/m5.png';
import m6 from '../../assets/moments/m6.png';
import m7 from '../../assets/moments/m7.png';
import m8 from '../../assets/moments/m8.png';
import m9 from '../../assets/moments/m9.png';
import m10 from '../../assets/moments/m10.png';
import m11 from '../../assets/moments/m11.png';
import m12 from '../../assets/moments/m12.png';
import m13 from '../../assets/moments/m13.png';
import m14 from '../../assets/moments/m14.png';
import m15 from '../../assets/moments/m15.png';
import m16 from '../../assets/moments/m16.png';
import m17 from '../../assets/moments/m17.png';
import m18 from '../../assets/moments/m18.png';

const GalleryWall = () => {
    // Array of images for the grid (Jumbled and exactly 18 items to fit the 6x3 grid perfectly)
    const images = [
        m2, m4, m18, m1, m15, m7,
        m16, m13, m14, m5, m9, m17,
        m12, m8, m3, m11, m6, m10
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
