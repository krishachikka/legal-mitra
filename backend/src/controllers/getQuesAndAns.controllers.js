import QuesAndAnswer from "../models/quesAndAns.models.js";

export const getQuesAndAns = async (req, res) => {
    try {

        // Fetch all common laws from the collection
        const ans = await QuesAndAnswer.find();

        // If no laws are found
        if (!ans.length) {
            return res.status(404).json({ message: 'No question answers found.' });
        }

        // Send the laws as a response
        return res.status(200).json(ans);

    } catch (error) {
        console.error('Error fetching question answers:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch question answers.' });
    }
}