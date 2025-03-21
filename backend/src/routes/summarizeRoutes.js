// routes/summarizeRoutes.js

import express from 'express';
import { summarizeText } from '../controllers/summarizeController.js';

const router = express.Router();

// Summarize route
router.post('/', summarizeText);

export default router;
