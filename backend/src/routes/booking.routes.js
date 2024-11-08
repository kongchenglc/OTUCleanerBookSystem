
import { Router} from 'express'
import {} from '../controllers/booking.controller.js'

const router = Router()





router.route('/').post(createBooking);
router.route('/').get(getHomeownerBookings);
router.route('/:bookingId').get(getBookingById);

export default router
