import mongoose from 'mongoose';

// Define the schema
const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile_no: { type: String, required: true },
  email: { type: String, required: true },
  // ratings: { type: Number, default: 0 },
  image: { type: String, default: null },
  certificate: { type: String, default: null },
  idProof: { type: String, default: null },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  top_cases: [{ case_name: String, rating: Number }],
  // total_cases: { type: Number, default: 0 },
});

// Model
const Lawyer = mongoose.model('Lawyer', lawyerSchema);

// Save a new lawyer
const saveLawyer = async (data) => {
  const lawyer = new Lawyer(data);
  await lawyer.save();
};
export default Lawyer;
