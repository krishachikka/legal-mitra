import express from 'express';
import { createUser, getUsers } from '../controllers/user.controllers.js';  // Using import

const router = express.Router();

// Route to create a new user
router.post('/users', createUser);

// Route to get all users (for testing)
router.get('/users', getUsers);

export default router;  // Export the router
