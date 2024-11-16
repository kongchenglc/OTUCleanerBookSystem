import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Service } from '../models/services.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";

// create a new service 

const createService = asyncHandler(async(req,res) => {
  
  const {name, description, basePrice, duration} = req.body;
  // Project v2 change stuff add start
    const homeownerId =  req.user._id;
  // Project v2 change stuff stop

  try {
    const newService = new Service({
      name,
      description,
      homeownerId,
      basePrice,
      duration,
    });
   console.log('this is working' , {newService})
    await newService.save({validateBeforeSave: false});
  
    return res.
    status(201)
    .json(
      new ApiResponse(201, newService, "service created successfully")
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Error creating Service")
  }
})


// get all the services 

const getAllServices = asyncHandler(async(req, res)=>{
  try {
    // add for v2 of code 
    // const query = req.user.role === 'homeowner' ? { homeownerId: req.user._id } : { cleanerId: req.user._id };
    // const services = await Service.find({query});
    // v2 stop 
    
    // v1 code commented
    const services2 = await Service.find({});
    return res
    .status(200)
    .json(
      new ApiResponse(200, services2)
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching Services")
  }
})

// const getServiceById = asyncHandler(async(req, res) => {
//   const { serviceId } = req.params;
// try {
//     const service = await Service.findById(serviceId);
//     if(!service){
//       throw new ApiError(404, "service does not exist")
//     }

//     if (req.user.role === 'homeowner' && service.homeownerId.toString() !== req.user._id.toString()) {
//       throw new ApiError(403, "Access denied");
//     }

//     if (req.user.role === 'cleaner' && service.cleanerId?.toString() !== req.user._id.toString()) {
//       throw new ApiError(403, "Access denied");
//     }

//     return res
//     .status(200)
//     .json(
//       new ApiResponse(200,service,"service by id true")
//     )
// } catch (error) {
//   throw new ApiError(500, error?.message || 'error fetching service')
// }
// })

// Acc . to v2 code :- only landlord can update the service to finished, while a cleaner can only update it to progress
const updateService =  asyncHandler(async(req,res) => {
  const {serviceId} = req.params;
  const {name, description, basePrice, duration, status}= req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { name, description, basePrice, duration, status},
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

  // allow cleaners to view the available services 
  const getAvailableServiceForCleaner = asyncHandler(async (req, res)=> {
    try {
      const services = await Service.find({ status: 'waiting cleaner'});
    
      return res
      .status(200)
      .json(new ApiResponse(200, services, "Available services fetched"));
    } catch (error) {
      throw new ApiError(500, error?.message || "Error fetching available services");
    }
  })

// cleaner choose a service 
const chooseServiceToWorkOn = asyncHandler(async(req,res)=>{
  const {serviceId} = req.params;
  const cleanerId = req.user._id;
  console.log({cleanerId})

  try {
    // find the service by ID
    const service = await Service.findById(serviceId);

    if(!service){
      throw new ApiError(404, "Service not found");
    }

    // if the service already has a cleaner assigned , reject the request
    if(service.cleanerId){
      throw new ApiError(400, "This service is already assigned to another cleaner")
    }

    // update the service status and assign the cleaner to it.
    service.status = 'in progress';
    service.cleanerId = cleanerId;

    await service.save();

    return res
    .status(200)
    .json(new ApiResponse(200, service, "Service picked up by the cleaner"))
  }
  catch(error){
    throw new ApiError(500, error?.message || "Error while choosing the service");
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
  // getServiceById,
  updateService,
  chooseServiceToWorkOn,
  getAvailableServiceForCleaner,
  deleteService
}

// res.status(200).json({ success: true, service });
// } catch (error) {
//   res.status(500).json({ success: false, message: 'Error fetching service', error });
// }
// };