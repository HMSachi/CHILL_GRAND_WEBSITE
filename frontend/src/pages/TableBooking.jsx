import React from 'react';
import BookingHero from '../components/tablebooking/BookingHero';
import BookingSteps from '../components/tablebooking/BookingSteps';
import BookingForm from '../components/tablebooking/BookingForm';
import '../styles/pages/TableBooking.css';

const TableBooking = () => {
    return (
        <div className="table-booking-page">
            <BookingHero />
            <BookingSteps />
            <div className="table-booking-main-content" id="reservation-form">
                <div className="table-booking-inner">
                    <BookingForm />
                </div>
            </div>
        </div>
    );
};

export default TableBooking;
