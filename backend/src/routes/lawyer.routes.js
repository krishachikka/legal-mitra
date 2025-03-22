import express from 'express';
import multer from 'multer';  // Multer for handling file uploads
import { getLawyerById, getLawyers, becomeALawyer } from '../controllers/lawyer.controllers.js';

const router = express.Router();

// Multer setup for file upload (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to get all lawyers without pagination
router.get('/lawyers', getLawyers);

// Route to get a specific lawyer by ID
router.get('/lawyers/:id', getLawyerById);

// Route to handle the lawyer form submission with multiple files (image, certificate, idProof)
router.post('/become-a-lawyer', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), becomeALawyer);

export default router;
