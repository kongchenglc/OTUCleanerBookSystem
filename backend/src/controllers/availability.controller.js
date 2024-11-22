
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Availability } from "../models/availability.model.js"

// create availability 

const createAvailability = asyncHandler(async(req,res) =>{
  const {cleanerId, date, timeSlots, isAvailable} = req.body;

  try {
    const newAvailability = new Availability({
      cleanerId,
      date,
      timeSlots,
      isAvailable
    });
  
    await newAvailability.save();
  
    return res
    .status(201)
    .json( new ApiResponse(
      201, "Availability created successfully", newAvailability
    ))
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching availability")
  }

})


const getAvailabilitybyDate = asyncHandler(async(req, res)=> {
  const {date} = req.paramas;

  try {
    const availability = await Availability.find({
      date: new Date(date)
    }).populate('cleanerId', 'firstName lastName');
  
    if(!availability || availability.length === 0){
      return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            success:true,
            availability
          }
        )
      )
  } 
  }
  catch (error) {
    throw new ApiError(500, error?.message || "Error fetching availability")
  }
})

const updateAvailability = asyncHandler(async(req,res) => {
  const {availabilityId} = req.params;
  const {date, timeSlots, isAvailable} = req.body;

  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      availabilityId,
      {
        date,
        timeSlots,
        isAvailable
      },
      {new:true, runValidators:true}
    );
  
    if(!updateAvailability){
     throw new ApiError(404, "Availability not found");
    }
  
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { 
          success:true,
          message:"Availability updated successfully",
          updatedAvailability
        }
      )
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Error updating availabilty")
  }
})

// deleting availability by id

const deleteAvailability = asyncHandler(async(req,res) => {
  const {availabilityId}= req.params;
  
  try {
    const deleteAvailability = await Availability.findByIdAndDelete(availabilityId);
  
    if(!deleteAvailability){
      throw new ApiError(404, " Availability not found")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {
          success: true,
          message: 'Availability deleted successfully',
          deleteAvailability
        }
      )
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Error deleting availability")
  }
})

export {
  createAvailability,
  getAvailabilitybyDate,
  updateAvailability,
  deleteAvailability
}