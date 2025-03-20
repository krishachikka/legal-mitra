import CaseJudgement from "../../models/dataset_models/caseJugdements.models.js";

export const getCaseJudgements = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
    const limit = parseInt(req.query.limit) || 10; // Set limit to 10 instead of 20

    try {
        // Fetch case judgements with pagination
        const judgements = await CaseJudgement.find()
            .skip((page - 1) * limit)
            .limit(limit);

        // Get the total count for pagination
        const totalJudgements = await CaseJudgement.countDocuments();

        // If no judgements are found
        if (judgements.length === 0) {
            return res.status(404).json({ message: 'No Judgements found.' });
        }

        // Send the judgements along with total count and pagination info
        return res.status(200).json({
            judgements,
            totalPages: Math.ceil(totalJudgements / limit),
            currentPage: page
        });

    } catch (error) {
        console.error('Error fetching Judgements:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch Judgements.' });
    }
}
