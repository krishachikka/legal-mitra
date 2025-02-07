import { Router } from 'express';
import { getQuesAndAns } from '../controllers/getQuesAndAns.controllers.js';

const router = Router();

router.route('/').get(getQuesAndAns);

export default router;