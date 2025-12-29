import React from 'react';
import FullScreenSlider from '../components/landing/FullScreenSlider';
import LandingQrSection from '../components/landing/LandingQrSection';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingCTA from '../components/landing/LandingCTA';
import '../styles/pages/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <FullScreenSlider />
            <LandingQrSection />
            <LandingFeatures />
            <LandingCTA />
        </div>
    );
};

export default LandingPage;
