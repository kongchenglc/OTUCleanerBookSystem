import { Router } from "express";
import { createReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route('/createReview').post(verifyJWT, createReview);

export default router
