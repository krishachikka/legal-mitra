import { Router } from 'express';
import { getQuesAndAns } from '../../controllers/api_calls/getQuesAndAns.controllers.js';

const router = Router();

router.route('/').get(getQuesAndAns);

export default router;