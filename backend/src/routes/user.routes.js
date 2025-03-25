import express from 'express';
import { createUser, getUsers } from '../controllers/user.controllers.js';
import multer from 'multer';
import path from 'path';

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Create an Express router
const router = express.Router();

// Route to create a new user (handle file uploads)
router.post('/users', upload.fields([{ name: 'image' }, { name: 'certificate' }, { name: 'idProof' }]), createUser);

// Route to get all users (for testing)
router.get('/users', getUsers);



export default router;
