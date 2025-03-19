import { Router } from 'express';
import { getCaseJudgements } from '../../controllers/api_calls/getCaseJudgements.controllers.js';

const router = Router();

router.route('/').get(getCaseJudgements);



export default router;