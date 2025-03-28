import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";  // Assuming cloudinary is configured
import Lawyer from "../models/lawyer.models.js";

// Fetch all lawyers from the database
const getLawyers = asyncHandler(async (req, res) => {
  try {
    const lawyers = await Lawyer.find();  // Fetch all lawyers from the database

    if (!lawyers || lawyers.length === 0) {
      return res.status(404).json({
        message: "No lawyers found.",
      });
    }

    return res.status(200).json({
      message: "Lawyers fetched successfully",
      data: lawyers,
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching lawyers.",
      error: error.message,
    });
  }
});





// Handle the lawyer form submission and file upload
const uploadLawyerDetails = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        message: "Please upload both education certificate (PDF) and profile photo (Image).",
      });
    }

    const [educationCertificate, profilePhoto] = req.files;

    // Upload files to Cloudinary
    const educationCertResult = await cloudinary.uploader.upload(educationCertificate.path, {
      folder: "lawyers/educationCertificates",
    });

    const profilePhotoResult = await cloudinary.uploader.upload(profilePhoto.path, {
      folder: "lawyers/profilePhotos",
    });

    // Extract other form data
    const { name, email, contactNo, noOfCasesSolved, location } = req.body;  // Added location

    // Create a new lawyer record
    const newLawyer = new Lawyer({
      name,
      email,
      contactNo,
      noOfCasesSolved,
      location,  // Saving location data
      educationCertificate: educationCertResult.secure_url,  // Store URL of the PDF
      profilePhoto: profilePhotoResult.secure_url,  // Store URL of the image
    });

    await newLawyer.save();

    return res.status(200).json({
      message: "Lawyer details uploaded successfully!",
      data: {
        name: newLawyer.name,
        profilePhoto: newLawyer.profilePhoto,
        educationCertificate: newLawyer.educationCertificate,
        location: newLawyer.location,  // Returning location data
      },
    });
  } catch (error) {
    console.error("Error in uploading lawyer details:", error);
    return res.status(500).json({
      message: "Something went wrong while uploading lawyer details.",
      error: error.message,
    });
  }
});


// Fetch a lawyer by ID
const getLawyerById = asyncHandler(async (req, res) => {
  try {
    const { lawyerId } = req.params;  // Get the lawyerId from request parameters

    const lawyer = await Lawyer.findById(lawyerId);  // Find the lawyer by ID

    if (!lawyer) {
      return res.status(404).json({
        message: "Lawyer not found.",
      });
    }

    return res.status(200).json({
      message: "Lawyer fetched successfully",
      data: lawyer,
    });
  } catch (error) {
    console.error("Error fetching lawyer:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching the lawyer.",
      error: error.message,
    });
  }
});

export { uploadLawyerDetails, getLawyers, getLawyerById };