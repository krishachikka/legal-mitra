import { Router } from 'express';
import { getIndianConstitution } from '../controllers/getIndianConstitution.controllers.js'

const router = Router();

router.route('/').get(getIndianConstitution);

export default router;