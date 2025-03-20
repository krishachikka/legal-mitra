import { Router } from 'express';
import { getIndianConstitution } from '../../controllers/api_calls/getIndianConstitution.controllers.js'

const router = Router();

router.route('/').get(getIndianConstitution);

export default router;