import { Router } from 'express'
import { registerUser  } from '../controllers/user.controller.js'
// for handling file 
import {upload} from '../middlewares/multer.middleware.js'
const router = Router()

router.route("/register").post(
  // injecting a middleware before registering user 
  upload.fields([
    {
      name:"avatar",
      maxCount:1
    }
  ]),
  registerUser
)
// router.route("/login").post(login)

export default router 