import { Router } from 'express'
import {} from '../controllers/service.controller.js'

const router =  Router()

router.route('/').get(getAllServices);
router.route('/:serviceId').get(getServiceById);

export default router