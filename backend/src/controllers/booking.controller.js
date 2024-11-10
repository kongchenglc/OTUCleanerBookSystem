import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from '../models/booking.model.js';
import { Service } from '../models/services.model.js';
import { User } from '../models/user.model.js';

// creating a booking(landlord books a cleaner)

const createBooking = asyncHandler(async (req,res)=> {
  // extracting the necessary fields from the request body
  const {cleanerId, bookingDate,  specialInstructions} = req.body;
  const { serviceId, name, basePrice} = req.body.service
  
  // Not sure -- Assuming get it from the req.user, from the authentication middleware
  const landlordId = req.user._id;
  console.log("landlord", landlordId)
  // console.log(user._id)
    // verify the cleaner exist and has the cleaner role 
    try {
      console.log("this work")

      const cleaner = await User.findOne(
        { 
        _id: cleanerId
        , role: "cleaner" 
      }
    )
      console.log({cleaner})

      if(!cleaner){
        throw new ApiError(404, "cleaner does not exist")
      }
  
    // verify the service exist
      const service = await Service.findById(serviceId);
      console.log('service is working', serviceId)
      if(!service){
        throw new ApiError(404, "service does not exist")
      }

      console.log({service})
      // calculate total price  
      const totalPrice = service.basePrice;
  
      // create a new booking instance
  
      const booking = new Booking({
        homeownerId: landlordId, 
        cleanerId,
        service: {
          serviceId: service._id,
          name: service.name,
          rate: service.basePrice,
          bookingDate,
          totalPrice,
        },
        specialInstructions,
        status: 'Pending'
      });
  
      // save the booking
      await booking.save({validationBeforeSave: false})
  
      return res
      .status(200)
      .json(
        new ApiResponse(
          200, 
          {
            success: true,
            message: "Booking created successfully",
            booking
          }
        )
      )
    } catch (error) {
      throw new ApiError(401, error?.message || "Error creating booking")
    }

})

export {
  createBooking
}