import { Router } from 'express';
import { getWorkerLaws } from '../../controllers/api_calls/workerLaws.controllers.js';

const router = Router();

router.route('/').get(getWorkerLaws);

export default router;