import User from '../models/user.models.js';  // Using import instead of require

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, mobileNo, email, experience, location, totalCases, topCases } = req.body;

    const newUser = new User({
      name,
      mobileNo,
      email,
      experience,
      location,
      totalCases,
      topCases,
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
