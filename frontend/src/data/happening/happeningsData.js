// ======================================================================
// HAPPENINGS DATA
// ======================================================================
// To add a new poster/flyer:
//   1. Save the image to this folder (src/dummy/happening/)
//   2. Import it below
//   3. Add a new object to the happeningsData array
// ======================================================================

import pubBooking from './pub_booking.jpg';
import liveMusicWeekend from './live_music_weekend.png';

const happeningsData = [
    {
        id: 1,
        img: pubBooking,
        title: 'Book the Entire Pub',
        tag: 'Offers',
        desc: 'Book the entire pub for just Rs. 15,000 NET! Perfect for birthday parties, batch meetups, and office get-togethers. Includes 5 hours of 100% private pub booking, free professional DJ support, delicious food & beverage menu, and maximum privacy with unmatched party vibes!'
    },
    {
        id: 2,
        img: liveMusicWeekend,
        title: 'Live Music Weekend',
        tag: 'Live Music',
        desc: '2 Nights. 2 Vibes. 1 Epic Weekend! Friday Night: Melodies & Memories with a live singing performance. Saturday Night: Acoustic Chill Session with our special guitar artist. Entrance FREE this weekend! Book your table in advance.'
    },
];

export default happeningsData;
