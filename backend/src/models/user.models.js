import mongoose from 'mongoose';

// Define schema for the user data
const topCaseSchema = new mongoose.Schema({
  caseName: { type: String, required: true },
  rating: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  totalCases: { type: Number, required: true },
  topCases: [topCaseSchema],
});

const User = mongoose.model('User', userSchema);

export default User;
