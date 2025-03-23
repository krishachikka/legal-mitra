import mongoose from 'mongoose';
import Lawyer from '../models/lawyer.models.js';
import cloudinary from '../../config/cloudinary.js';
import validator from 'validator';  // For validation

// Controller to get all lawyers without pagination
export const getLawyers = async (req, res) => {
    try {
        const lawyers = await Lawyer.find();

        if (lawyers.length === 0) {
            return res.status(404).json({ message: 'No Lawyers found.' });
        }

        return res.status(200).json(lawyers);
    } catch (error) {
        console.error('Error fetching Lawyers:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch Lawyers.' });
    }
};

// Controller to get a specific lawyer by ID
export const getLawyerById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Lawyer ID' });
    }

    try {
        const lawyer = await Lawyer.findById(id);

        if (!lawyer) {
            return res.status(404).json({ message: 'Lawyer not found.' });
        }

        return res.status(200).json(lawyer);
    } catch (error) {
        console.error('Error fetching Lawyer:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch Lawyer.' });
    }
};

// Upload file to Cloudinary
const uploadFileToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    reject(error);  // Reject the promise if upload fails
                } else {
                    console.log('File uploaded successfully:', result);  // Log the result for verification
                    resolve(result.secure_url);  // Return the file URL
                }
            }
        ).end(file.buffer);
    });
};

// Controller for handling the lawyer registration process
export const becomeALawyer = async (req, res) => {
    const { name, mobile_no, email, experience, location, total_cases, top_cases, ratings = 0 } = req.body;

    try {
        // Validate input fields
        if (!name || !mobile_no || !email || !experience || !location || !total_cases || !top_cases) {
            return res.status(400).json({ message: 'All fields are required: name, mobile_no, email, experience, location, total_cases, top_cases.' });
        }

        // Validate email and mobile number format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!validator.isMobilePhone(mobile_no, 'any', { strictMode: false })) {
            return res.status(400).json({ message: 'Invalid mobile number' });
        }

        // Check if all required files are present in the request
        if (!req.files || !req.files.image || !req.files.certificate || !req.files.idProof) {
            return res.status(400).json({ message: 'All files are required: image, certificate, idProof.' });
        }

        // Validate file types
        const imageFile = req.files.image[0];
        const certificateFile = req.files.certificate[0];
        const idProofFile = req.files.idProof[0];

        // Validate image format (JPEG, PNG)
        if (!imageFile.mimetype.match(/image\/(jpeg|png)/)) {
            return res.status(400).json({ message: 'Image must be in JPEG or PNG format.' });
        }

        // Validate PDF format for certificate and ID proof
        if (certificateFile.mimetype !== 'application/pdf') {
            return res.status(400).json({ message: 'Certificate must be a PDF file.' });
        }

        if (idProofFile.mimetype !== 'application/pdf') {
            return res.status(400).json({ message: 'ID Proof must be a PDF file.' });
        }

        // Upload all files to Cloudinary asynchronously
        const imageUrl = await uploadFileToCloudinary(imageFile, 'lawyer_images');
        const certificateUrl = await uploadFileToCloudinary(certificateFile, 'lawyer_certificates');
        const idProofUrl = await uploadFileToCloudinary(idProofFile, 'lawyer_id_proof');

        // Create a new lawyer record in the database
        const newLawyer = new Lawyer({
            name,
            mobile_no,
            email,
            ratings,      // Store the ratings
            image: imageUrl, // Image URL from Cloudinary
            certificate: certificateUrl, // Certificate URL from Cloudinary
            idProof: idProofUrl, // ID Proof URL from Cloudinary
            experience,
            location,
            top_cases,    // Include top cases
            total_cases,  // Include total cases solved
        });

        await newLawyer.save();

        res.status(201).json({ message: 'Lawyer application submitted successfully', lawyer: newLawyer });
    } catch (error) {
        console.error('Error submitting lawyer application:', error.message);
        return res.status(500).json({ message: 'Server error, unable to submit application.' });
    }
};
