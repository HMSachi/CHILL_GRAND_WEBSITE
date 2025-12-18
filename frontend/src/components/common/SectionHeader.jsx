import React from 'react';
import '../../styles/pages/PlanEvent.css'; // Ensure styles are available

const SectionHeader = ({ title, subtitle }) => {
    return (
        <div className="section-header-container">
            <h2 className="section-header">{title}</h2>
            <div className="header-underline"></div>
            {subtitle && <p className="section-desc-text">{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
