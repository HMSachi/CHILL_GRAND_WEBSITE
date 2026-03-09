import React from 'react';
import BookingHero from '../components/tablebooking/BookingHero';
import BookingSteps from '../components/tablebooking/BookingSteps';
import BookingForm from '../components/tablebooking/BookingForm';

const TableBooking = () => {
    return (
        <div className="table-booking-page">
            <BookingHero />
            <BookingSteps />
            <BookingForm />
        </div>
    );
};

export default TableBooking;
