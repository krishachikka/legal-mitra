import { Router } from "express";
import multer from "multer";
import { uploadLawyerDetails, getLawyers, getLawyerById } from "../controllers/lawyer.controllers.js";

// Multer configuration for file uploads
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);  // Ensure unique filenames
    },
});

const upload = multer({ storage: storage });

const router = Router();

// POST route for uploading lawyer details with files
router.route("/upload")
    .post(upload.array("files", 2), uploadLawyerDetails);  // Expecting two files: education certificate and profile photo

// GET route for all lawyers
router.route("/lawyers")
    .get(getLawyers);

// GET route for a single lawyer by ID
router.route("/:lawyerId")
    .get(getLawyerById);

export default router;
