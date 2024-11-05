import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

// based on user id , find the user , generate the tokens, 
// save the refresh token in the database 
const generateAccessTokenAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {
      accessToken, refreshToken
    }
  }
  catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
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

  const { username, email, firstName, lastName, password } = req.body

  if ([firstName, lastName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are compulsory and required')
  }

  // if their is existed user 
  const existedUser = await User.findOne({ 
    $or: [{username},{email}]
   })
   console.log({username})
  if (existedUser) {
    throw new ApiError(409, "User with the username already exists")
  }

  // middleware - add more fields in request like files add
  // const avatarLocalPath = req.files?.avatar[0]?.path || null;

  // changes to remove avatar
  // const avatarLocalPath = req.files?.avatar?.[0]?.path || null;

  // if(!avatarLocalPath){
  //   throw new ApiError(400,"Avatar files is required")
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // await uploadOnCloudinary(coverImage)

  // if(!avatar) {
  //   throw new ApiError(400,'Avatar file is required')
  // }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({

    // avatar: avatar.url,
    // find image from the url if not their  keep it empty
    firstName,
    lastName,
    email,
    password,
    username,
    // 
  })
  // using .select to chain the things we want 
  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  )

  // res.status(200).json({
  //   message: "ok"  
  // })
})

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or mail 
  // find the user
  // password check
  // access and refresh token 
  // send cookie
  const { username, password } = req.body
  if (!username) {
    throw new ApiError(400, "username or password is required")
  }
  const user = await User.findOne({ username });
  // if can't find the user
  if (!user) {
    throw new ApiError(404, "User does not exist")
  }
  console.log(user)
  //  from the schema defined -- created custom generated functions 
  const isPasswordValid = await user.isPasswordCorrect(password)
  console.log({ isPasswordValid })
  // if (!isPasswordValid) {
  //   throw new ApiError(401, "Invalid user credentials")
  // }
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id)
  const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")
  // httpOnly and secure - true , cookies can keep modified by server only
  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "user logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  // find the user
  // reset refreshToken

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  //removed refreshTokens from the database

  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccesstoken = asyncHandler(async (req, res)=> {
  const incomingRefershToken =  req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefershToken){
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefershToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401, "Invalid refresh token")
    }
  
    if(incomingRefershToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired or used")
    }
  
    // generate new refresh token
  
    const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshTokens(user._id)
    
    const options = {
      httpOnly: true,
      secure: true
    }
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken, newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token")
  }



})
export { 
  registerUser,
  loginUser, 
  logoutUser,
  refreshAccesstoken 

}