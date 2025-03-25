import multer from 'multer';

// Set storage configuration for multer
const storage = multer.memoryStorage();

// Set up multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept image files
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export default upload;
