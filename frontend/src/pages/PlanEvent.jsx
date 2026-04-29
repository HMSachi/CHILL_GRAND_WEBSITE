import React from 'react';
import '../styles/pages/PlanEvent.css';
import EventHero from '../components/events/EventHero';
import EventTypes from '../components/events/EventTypes';


const PlanEvent = () => {
    return (
        <div className="plan-event-page">
            <EventHero />
            <EventTypes />

        </div>
    );
};

export default PlanEvent;
