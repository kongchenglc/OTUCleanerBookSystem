import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review }from '../models/review.model.js';
import { Booking } from '../models/booking.model.js'

// 
const createReview = asyncHandler(async(req, res)=> {
  // 
  const { bookingId, rating, comment} = req.body;
  console.log('running');
  try {
    const homeownerId = req.user._id;
    console.log({homeownerId})
  // to check the booking is existed and is completed
    const booking = await Booking.findOne({
      _id:bookingId,
      homeownerId
    })
    console.log({booking});
    
    if(!booking){
      throw new ApiError(404, "Booking not found or you are not authorized")
    }
    if(booking.status !== 'Completed'){
      console.log('failed')
      throw new ApiError(400, "Cannot review an incomplete booking")
    }
  
    // check if a review already exists for this booking
    const existingReview = await Review.findOne({bookingId})
    console.log('Existing review their', {existingReview})
    if(!existingReview){
      throw new ApiError(400,"Review already exist for this booking")
    }
    console.log("passed not existed phase")
    // create a new review 
    const newReview = new Review({
      bookingId,
      homeownerId,
      cleanerId: booking.cleanerId,
      rating,
      comment
    })
  
    await newReview.save({validateBeforeSave:false});

    return res
    .status(200)
    .json(new ApiResponse(201,"review created successfully",{newReview}))
  } catch (error) {
    return new ApiError(500,error?.message || "Error creating review")
  }

})

export {
  createReview
}