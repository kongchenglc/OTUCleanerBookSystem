import { Router } from "express";
import { createAvailability, getAvailabilitybyDate, updateAvailability,deleteAvailability } from '../controllers/availability.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/createAvail').post(verifyJWT, createAvailability)
router.route('/getAvailByDate').get(verifyJWT, getAvailabilitybyDate)
router.route('/updateAvail').put(verifyJWT, updateAvailability)
router.route('/deleteAvail').delete(verifyJWT, deleteAvailability)

export default router