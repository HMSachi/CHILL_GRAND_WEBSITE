import React from 'react';
import '../styles/pages/About.css';
import AboutIntro from '../components/about/AboutIntro';
import AboutTeam from '../components/about/AboutTeam';
import WhyChooseUs from '../components/about/WhyChooseUs';
import WorkingHours from '../components/about/WorkingHours';
import Testimonials from '../components/about/Testimonials';
import QrCodeSection from '../components/about/QrCodeSection';

const About = () => {
    return (
        <div className="about-page">
            <AboutIntro />
            <AboutTeam />
            <WhyChooseUs />
            <WorkingHours />
            <Testimonials />
            <QrCodeSection />
        </div>
    );
};

export default About;
