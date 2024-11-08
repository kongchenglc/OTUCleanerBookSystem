
import { Router} from 'express'
import { createBooking } from '../controllers/booking.controller.js'

const router = Router()


router.route('/createBooking').post(createBooking);
// router.route('/').get(getHomeownerBookings);
// router.route('/:bookingId').get(getBookingById);

export default router
