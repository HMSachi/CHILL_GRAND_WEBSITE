import React from 'react';
import '../styles/pages/About.css';
import AboutHero from '../components/about/AboutHero';
import AboutIntro from '../components/about/AboutIntro';
import AboutTeam from '../components/about/AboutTeam';
import WorkingHours from '../components/about/WorkingHours';
import QrCodeSection from '../components/about/QrCodeSection';

const About = () => {
    return (
        <div className="about-page">
            <AboutHero />
            <AboutTeam />
            <WorkingHours />
            <QrCodeSection />
        </div>
    );
};

export default About;
