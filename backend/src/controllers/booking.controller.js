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
  // console.log("landlord", landlordId)
  // console.log(user._id)
    // verify the cleaner exist and has the cleaner role 
    try {
      // console.log("this work")

      const cleaner = await User.findOne(
        { 
        _id: cleanerId
        , role: "cleaner" 
      }
    )
      // console.log({cleaner})

      if(!cleaner){
        throw new ApiError(404, "cleaner does not exist")
      }
  
    // verify the service exist
      const service = await Service.findById(serviceId);
      // console.log('service is working', serviceId)
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

const getLandlordBookings = asyncHandler(async(req,res)=>{
  const landlordId = req.user._id;
  console.log(landlordId)
  // const landlordId = req.user._id;

  try {
    const bookings = await Booking
    .find({homeownerId: landlordId})
    .populate('cleanerId', 'firstname lastname');
    return res.status(200).json(new ApiResponse(200, {success:true, bookings}))
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching bookings")
  }
})

const getBookingById = asyncHandler(async(req,res) => {
  const {bookingId} = req.params;
  const landlordId = req.user._id;

  try {
    const booking = await Booking.findOne({_id: bookingId, homeownerId: landlordId})
    .populate('cleanerId', 'firstName lastName')
    .populate('service.serviceId', 'name basePrice')
    if(!booking){
      throw new ApiError(404, "Booking not found or youa are not authorized to view this booking")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {success:true, booking}));
    
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching booking")
  }
})

  const updateBookingById = asyncHandler(async(req,res)=>{
    const {bookingId} = req.params;
    const landlordId = req.user._id;
    const {bookingDate, specialInstructions, status} = req.body;
    console.log({bookingId},{landlordId});
    
    try {
      const booking = await Booking.findOne({ _id: bookingId, homeownerId: landlordId});
  
      if(!booking){
        throw new ApiError(404, "Booking not found");
      }
  
      // check if the booking is in a modifiable state
      if(booking.status === 'completed' || booking.status === 'cancelled'){
        throw new ApiError(400,"Cannot update a completed or cancelled booking")
      }
  
      if(!booking){
        throw new ApiError(404, "booking not found")
      }
  
      if(bookingDate) booking.service.bookingDate = bookingDate;
      if(specialInstructions) booking.specialInstructions = specialInstructions;
      if(status){
        if(['Pending','Confirmed','Completed','Cancelled'].includes(status)){
          booking.status = status;
        } else {
          throw new ApiError(400,"Invalid status value")
        }
      }
  
      await booking.save();
  
      return res
      .status(200)
      .json(new ApiResponse(
        200, 'booking updated successfully', booking
      ))
    } catch (error) {
      throw new ApiError(500 , error?.message || "Error updated booking")
    }
  })


export {
  createBooking,
  getLandlordBookings,
  getBookingById,
  updateBookingById
}