import { Router } from 'express'
import { createService,
  getAllServices,
  // getServiceById,
  updateService,
  getAvailableServiceForCleaner,
  chooseServiceToWorkOn,
  deleteService} from '../controllers/service.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router =  Router()

//  all routes for landlord
router.route('/create').post(verifyJWT,createService);
router.route('/getAllServices').get(getAllServices);
// router.route('/:serviceId').get(getServiceById);
router.route('/:serviceId').put(updateService);
router.route('/:serviceId').delete(deleteService);

// all routes for the cleaner
router.route('/available').get(getAvailableServiceForCleaner);
router.route('/:serviceId/choose').put(verifyJWT, chooseServiceToWorkOn);

export default router