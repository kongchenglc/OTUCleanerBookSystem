import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'

// based on user id , find the user , generate the tokens, 
// save the refresh token in the database 
const generateAccessTokenAndRefreshTokens = async(userId) =>{
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {
      accessToken, refreshToken
    }
  }
  catch(error){
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

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
  
  const {username, email, firstName, lastName, password, rating } =  req.body
  console.log("email",email)
  console.log("rating", rating)
  
  if([firstName, lastName, email, username, rating].some((field) => field?.trim() === '' )
  ) {
    throw new ApiError(400,'All fields are compulsory and required')
  }

  // if their is existed user 
  const existedUser =  await User.findOne({
    $or: [{username},{email}]
  })

  if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
  }

// middleware - add more fields in request like files add
  // const avatarLocalPath = req.files?.avatar[0]?.path || null;

  // changes to remove avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
  
  // if(!avatarLocalPath){
  //   throw new ApiError(400,"Avatar files is required")
  // }
  
  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // await uploadOnCloudinary(coverImage)
  
  // if(!avatar) {
  //   throw new ApiError(400,'Avatar file is required')
  // }

  const user = await User.create({
    
    // avatar: avatar.url,
    // find image from the url if not their  keep it empty
    // firstName,
    // lastName,
    email,
    password,
    username: username.toLowerCase(),
    rating
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

const loginUser = asyncHandler(async (req,res) =>{
  // req body -> data
  // username or mail 
  // find the user
  // password check
  // access and refresh token 
  // send cookie

  const {email, username, password } = req.body

  if(!(username || email)){
    throw new ApiError(400, "username or password is required")
  }

  const user = await User.findOne({
    $or: [{username},{email}]
  })
  // if can't find the user
   if(!user){
    throw new ApiError(404,"User does not exist")
  }
//  from the schema defined -- created custom generated functions 
  const isPasswordValid = await user.isPasswordCorrect(password)
  console.log({isPasswordValid})
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }

  const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")
// httpOnly and secure - true , cookies can keep modified by server only
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "user logged in successfully"
    )
  )
})

const logoutUser = asyncHandler(async(req,res) => {
  // find the user
  // reset refreshToken

  await User.findByIdAndUpdate(
    req.user._id,
      {
        $set: {
          refreshToken:undefined
        }
      },
      { 
        new: true
      }
  )
  //removed refreshTokens from the database

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {},"User logged Out"))

})

export {registerUser, loginUser, logoutUser}