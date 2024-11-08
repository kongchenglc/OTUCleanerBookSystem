import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Service } from '../models/services.model.js'
import { ApiResponse } from "../utils/ApiResponse";

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
  throw new ApiError(500, error?.message || 'error fetching service ')
}
})

// res.status(200).json({ success: true, service });
// } catch (error) {
//   res.status(500).json({ success: false, message: 'Error fetching service', error });
// }
// };