import BookingSteps from '../components/tablebooking/BookingSteps';
import BookingForm from '../components/tablebooking/BookingForm';

const TableBooking = () => {
    return (
        <div className="table-booking-page">
            <div className="booking-split-container">
                <div className="split-left">
                    <BookingSteps />
                </div>
                <div className="split-right">
                    <BookingForm />
                </div>
            </div>
        </div>
    );
};

export default TableBooking;
