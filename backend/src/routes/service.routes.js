import { Router } from 'express'
import { createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService} from '../controllers/service.controller.js'

const router =  Router()

router.route('/create').post(createService);
router.route('/getAllServices').get(getAllServices);
router.route('/:serviceId').get(getServiceById);
router.route('/:serviceId').put(updateService);
router.route('/:serviceId').delete(deleteService);



export default router