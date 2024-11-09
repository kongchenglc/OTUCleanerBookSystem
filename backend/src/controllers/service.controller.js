import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Service } from '../models/services.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";

// create a new service 

const createService = asyncHandler(async(req,res) => {
  const {name, description, basePrice, duration} = req.body;

  try {
    const newService = new Service({
      name,
      description,
      basePrice,
      duration
    });
  
    await newService.save();
  
    return res.
    status(201)
    .json(
      new ApiResponse(201, newService, "service creaeted successfully")
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Error creating Service")
  }
})




// get all the services 


const getAllServices = asyncHandler(async(req, res)=>{
  try {
    const services = await Service.find({});
    return res
    .status(200)
    .json(
      new ApiResponse(200, services)
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching Services")
  }
})

const getServiceById = asyncHandler(async(req, res) => {
  const { serviceId } = req.params;
try {
    const service = await Service.findById(serviceId);
    if(!service){
      throw new ApiError(404, "service does not exist")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200,service,"service by id true")
    )
} catch (error) {
  throw new ApiError(500, error?.message || 'error fetching service')
}
})

const updateService =  asyncHandler(async(req,res) => {
  const {serviceId} = req.params;
  const {name, description, basePrice, duration}= req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { name, description, basePrice, duration},
      {
        new:true, runValidators:true
      }
    )
  
      if(!updateService){
        return res
        .status(404)
        .json(new ApiResponse(404,"Service not found"))
      }
  
      return res
      .status(200)
      .json(new ApiResponse(200,"Service updated successfully", updatedService))
      
  } catch (error) {
    throw new ApiError(500, error?.message || "Error updating Service" ) 
  }
})

const deleteService = asyncHandler(async (req,res) => {
  const {serviceId} = req.params;

  try {
    const deleteService = await Service.findByIdAndDelete(serviceId)
  
    if(!deleteService){
      throw new ApiError(404,"Service not found")
    }
  
    return res
    .status(200)
    .json(new ApiResponse(200, "Service deleted successfully"))
  
  } catch (error) {
    throw new ApiError(500, "Error deleting service")
  }
  
})

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
}

// res.status(200).json({ success: true, service });
// } catch (error) {
//   res.status(500).json({ success: false, message: 'Error fetching service', error });
// }
// };