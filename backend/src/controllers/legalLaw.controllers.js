// controllers/legalController.js
const LegalLaw = require("../models/commonLaws.models");

exports.getCommonLaws = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search in title or description (case-insensitive)
    const results = await LegalLaw.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Match title
        { description: { $regex: query, $options: "i" } }, // Match description
      ],
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching legal data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
