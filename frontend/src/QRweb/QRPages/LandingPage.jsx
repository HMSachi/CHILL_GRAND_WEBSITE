import React from 'react';
import FullScreenSlider from '../components/landing/FullScreenSlider';
import LandingQrSection from '../components/landing/LandingQrSection';

import LandingCTA from '../components/landing/LandingCTA';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <FullScreenSlider />
            <LandingQrSection />

            <LandingCTA />
        </div>
    );
};

export default LandingPage;
