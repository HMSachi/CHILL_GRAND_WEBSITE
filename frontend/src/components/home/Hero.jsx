import React, { useState, useEffect } from 'react';
import '../../styles/components/Hero.css';

import video1 from '../../assets/1st.mp4';
import video2 from '../../assets/2nd.mp4';
import video3 from '../../assets/3rd.mp4';
import video4 from '../../assets/4th.mp4';
import video5 from '../../assets/5th.mp4';
import video6 from '../../assets/6th.mp4';

const Hero = () => {
    const videos = [video1, video2, video3, video4, video5, video6];
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % videos.length);
        }, 2500); // Swift switch every 2.5 seconds
        return () => clearTimeout(timer);
    }, [currentIdx, videos.length]);

    const handleVideoEnded = () => {
        setCurrentIdx((prevIdx) => (prevIdx + 1) % videos.length);
    };

    return (
        <section className="hero" id="home">

            {/* Video Background - Playlist of 6 videos */}
            <video
                key={currentIdx}
                className="hero-video-bg"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
            >
                <source src={videos[currentIdx]} type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
                {/* Premium Glass Card */}
                <div className="hero-glass-card fade-up">
                    <div className="hero-top-line"></div>

                    <span className="hero-est">EST. 2024</span>

                    <div className="hero-welcome-text fade-up-delay-1">Welcome to</div>

                    <h1 className="hero-main-title fade-up-delay-2">
                        <span className="title-part-1">CHILL</span>
                        <span className="title-part-2">GRAND</span>
                    </h1>

                    <div className="hero-divider-line fade-up-delay-3">
                        <span className="divider-diamond">◆</span>
                    </div>

                    <div className="hero-subtitle-container fade-up-delay-3">
                        <span className="tagline-text">PUB  &  RESTAURANT</span>
                    </div>

                    <div className="hero-bottom-line"></div>
                </div>

                <div className="hero-actions fade-up-delay-4">
                    <a href="#booking" className="btn-luxury">
                        <span className="btn-glow"></span>
                        <span className="btn-label">RESERVE YOUR TABLE</span>
                    </a>
                    <a href="/plan-event" className="btn-luxury-outline">
                        <span className="btn-label">PLAN AN EVENT</span>
                    </a>
                </div>
            </div>

            <div className="hero-scroll-warehouse">
                <div className="hero-scroll-indicator">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
