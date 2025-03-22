import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Cloud Name:', process.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.VITE_CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.VITE_CLOUDINARY_API_SECRET);


// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

export default cloudinary;
