import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCLoudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async( req,res) => {
  //  get the user all details 
  // validation not empty
  // check if the user already exist : check username , email
  // photo image added or not - user response , then multer procide or not 
  // upload from cloudinary
  // create user object - create entry in db
  // remove refresh token and access token form the field 
  // remove password from the response 
  // check the user created or not (null)
  // return res 
  
  const {username, email, firstName, lastName, password } =  req.body
  console.log("email",email)
  
  if([firstName, lastName, email, username].some((field) => field?.trim() === '' )
  ) {
    throw new ApiError(400,'All fields are compulsory and required')
  }

  // if their is existed user 
  const existedUser =  User.findOne({
    $or: [{username},{email}]
  })

  if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
  }

// middleware - add more fields in request like files add
  const avatarLocalPath = req.files?.avatar[0]?.path
  
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar files is required")
  }
  
  const avatar = await uploadOnCLoudinary(avatarLocalPath)
  await uploadOnCLoudinary(coverImage )
  
  if(!avatar) {
    throw new ApiError(400,'Avatar file is required')
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    // find image from the url if not their  keep it empty
    email,
    password,
    username: username.toLowerCase()
    // 
  })
  // using .select to chain the things we want 
  const createdUser = await User.findById(user._id).select("-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering a user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser, "User Registered Successfully")
  )

  // res.status(200).json({
  //   message: "ok"  
  // })
})

export {registerUser}