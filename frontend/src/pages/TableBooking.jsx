import React from 'react';
import BookingHero from '../components/tablebooking/BookingHero';
import BookingSteps from '../components/tablebooking/BookingSteps';

const TableBooking = () => {
    return (
        <div className="table-booking-page">
            <BookingHero />
            <BookingSteps />
        </div>
    );
};

export default TableBooking;
