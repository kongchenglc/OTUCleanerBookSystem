import { Router } from 'express'
import { registerUser, loginUser, logoutUser, refreshAccesstoken  } from '../controllers/user.controller.js'
import  {verifyJWT}  from '../middlewares/auth.middleware.js'
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

router.route("/login").post(loginUser)

//secured routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccesstoken)

export default router 