import { Router } from 'express'
import { getFirIpcLaws } from '../../controllers/api_calls/getFirIpcLaws.controllers.js';

const router = Router();


router.route('/').get(getFirIpcLaws);

export default router;