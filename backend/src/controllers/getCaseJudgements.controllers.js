import CaseJudgement from "../models/caseJugdements.models.js";

export const getCaseJudgements = async (req, res) => {

    try {
        // Fetch all common laws from the collection
        const judgement = await CaseJudgement.find().limit(20);

        // If no laws are found
        if (!judgement.length) {
            return res.status(404).json({ message: 'No Judgement found.' });
        }

        // Send the laws as a response
        return res.status(200).json(judgement);

    } catch (error) {
        console.error('Error fetching Judgement:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch Judgement.' });
    }
}