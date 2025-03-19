import IndianConstitution from "../../models/dataset_models/indianConstitution.models.js"

export const getIndianConstitution = async (req, res) => {

    try {

        // Fetch all common laws from the collection
        const laws = await IndianConstitution.find();

        // If no laws are found
        if (!laws.length) {
            return res.status(404).json({ message: 'No constitution laws found.' });
        }

        // Send the laws as a response
        return res.status(200).json(laws);


    } catch (error) {
        console.error('Error fetching constitution laws:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch constitution laws.' });
    }

}