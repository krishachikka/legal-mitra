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
  educationCertificate: {
    type: String,  // URL of the uploaded PDF
    required: true,
  },
  profilePhoto: {
    type: String,  // URL of the uploaded image
    required: true,
  },
});

const Lawyer = mongoose.model('Lawyers_directory', lawyerSchema);
export default Lawyer;