import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req, _,next) => {
  //get access Token
  // to get userid 
  try {
    // why using access token 
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
    if(!token){
      throw new ApiError(401,"unauthorized request")
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  // decode token 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken ")
  
    if(!user)
      // discuss 
      throw new ApiError(401,"Invalid Access Token")
    // add an new object to req 
    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }

})