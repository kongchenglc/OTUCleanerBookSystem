
import { Router} from 'express'
import { createBooking, getLandlordBookings, getBookingById, updateBookingById} from '../controllers/booking.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router()

router.route('/createBooking').post(verifyJWT, createBooking);
router.route('/bookings').get(verifyJWT, getLandlordBookings);
router.route('/:bookingId').get(verifyJWT, getBookingById);
router.route('/:bookingId').put(verifyJWT, updateBookingById);

export default router
