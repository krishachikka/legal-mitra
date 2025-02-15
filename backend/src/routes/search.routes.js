import express from 'express';
import { search } from '../controllers/search.controllers.js';

const router = express.Router();

// Search route
router.get('/search', search);

export default router;
