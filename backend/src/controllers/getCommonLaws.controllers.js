import CommonLaws from '../models/commonLaws.models.js';

export const getCommonLaws = async (req, res) => {
    try {
        // Fetch all common laws from the collection
        const laws = await CommonLaws.find();

        // If no laws are found
        if (!laws.length) {
            return res.status(404).json({ message: 'No common laws found.' });
        }

        // Send the laws as a response
        return res.status(200).json(laws);
    } catch (error) {
        console.error('Error fetching common laws:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch common laws.' });
    }
};
