import React from 'react';
import '../styles/pages/PlanEvent.css';
import EventHero from '../components/events/EventHero';
import EventTypes from '../components/events/EventTypes';
import PastEvents from '../components/events/PastEvents';

const PlanEvent = () => {
    return (
        <div className="plan-event-page">
            <EventHero />
            <EventTypes />
            <PastEvents />
        </div>
    );
};

export default PlanEvent;
