import User from '../models/user.models.js';  // Using import instead of require

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, mobileNo, email, experience, location, totalCases, topCases, image, certificate, idProof } = req.body;

    // Ensure these URLs are being passed correctly
    const newUser = new User({
      name,
      mobileNo,
      email,
      experience,
      location,
      totalCases,
      topCases,
      image,        // This should be a URL from Cloudinary
      certificate,  // This should be a URL from Cloudinary
      idProof,      // This should be a URL from Cloudinary
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all users (optional, for testing)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
