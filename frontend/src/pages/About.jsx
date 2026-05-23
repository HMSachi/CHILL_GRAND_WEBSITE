import React from 'react';
import '../styles/pages/About.css';
import AboutStory from '../components/about/AboutStory';
import AboutTeam from '../components/about/AboutTeam';
import WorkingHours from '../components/about/WorkingHours';
import QrCodeSection from '../components/about/QrCodeSection';

const About = () => {
    return (
        <div className="about-page">
            <AboutStory />
            <AboutTeam />
            <WorkingHours />
            <QrCodeSection />
        </div>
    );
};

export default About;
