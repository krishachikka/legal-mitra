import mongoose, { Schema } from "mongoose";

const lawyerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  noOfCasesSolved: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  educationCertificate: {
    type: String,  // URL of the uploaded PDF
    required: true,
  },
  profilePhoto: {
    type: String,  // URL of the uploaded image
    required: true,
  },
  specialization: {
    type: String,
    required: true,  // Added specialization field
  },
  yearsOfExperience: {
    type: Number,
    required: true,  // Added yearsOfExperience field
  },
  description: {
    type: String,
    required: true,  // Added description field
  },
  availability: {
    type: String,
    required: true,  // Added availability field
  },
  bio: {
    type: String,
    required: true,  // Added bio field
  },
  languageSpoken: {
    type: String,
    required: true,  // Added languageSpoken field
  },
  education: {
    type: String,
    required: true,  // Added education field
  }
});

const Lawyer = mongoose.model('Lawyers_directory', lawyerSchema);
export default Lawyer;
