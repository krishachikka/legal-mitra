import { Router } from 'express';
import { getWorkerLaws } from '../controllers/workerLaws.controllers.js';

const router = Router();

router.route('/').get(getWorkerLaws);

export default router;