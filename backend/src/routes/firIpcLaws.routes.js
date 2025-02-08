import { Router } from 'express'
import { getFirIpcLaws } from '../controllers/getFirIpcLaws.controllers.js';

const router = Router();


router.route('/').get(getFirIpcLaws);

export default router;