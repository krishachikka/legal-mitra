import express from 'express';
import { getLawyerById, getLawyers } from '../controllers/lawyer.controllers.js';

const router = express.Router();

// Get all lawyers with pagination
router.get('/lawyers', getLawyers);

// Get a specific lawyer by ID
router.get('/lawyer/:id', getLawyerById);

export default router;
