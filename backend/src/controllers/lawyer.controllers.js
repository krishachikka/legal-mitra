import Lawyer from "../models/lawyer.models.js";

// Controller to get all lawyers without pagination
export const getLawyers = async (req, res) => {
    try {
        // Fetch all lawyers without pagination
        const lawyers = await Lawyer.find();

        // If no lawyers are found
        if (lawyers.length === 0) {
            return res.status(404).json({ message: 'No Lawyers found.' });
        }

        // Send all lawyers
        return res.status(200).json(lawyers);

    } catch (error) {
        console.error('Error fetching Lawyers:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch Lawyers.' });
    }
};

// Controller to get a specific lawyer by ID
export const getLawyerById = async (req, res) => {
    const { id } = req.params;

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
