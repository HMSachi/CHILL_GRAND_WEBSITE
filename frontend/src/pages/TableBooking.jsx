import BookingSteps from '../components/tablebooking/BookingSteps';
import BookingForm from '../components/tablebooking/BookingForm';

const TableBooking = () => {
    return (
        <div className="table-booking-page">
            <BookingSteps />
            <BookingForm />
        </div>
    );
};

export default TableBooking;
