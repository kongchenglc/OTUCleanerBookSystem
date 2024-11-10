
import { Router} from 'express'
import { createBooking, getLandlordBookings, getBookingById} from '../controllers/booking.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router()

router.route('/createBooking').post(verifyJWT, createBooking);
router.route('/bookings').get(verifyJWT, getLandlordBookings);
router.route('/:bookingId').get(getBookingById);

export default router
