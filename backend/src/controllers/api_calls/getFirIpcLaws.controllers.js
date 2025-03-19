import firIPC from "../../models/dataset_models/firIPC.models.js";

export const getFirIpcLaws = async (req, res) => {

    try {

        // Fetch all common laws from the collection
        const laws = await firIPC.find();

        // If no laws are found
        if (!laws.length) {
            return res.status(404).json({ message: 'No ipc laws found.' });
        }

        // Send the laws as a response
        return res.status(200).json(laws);


    } catch (error) {
        console.error('Error fetching ipc laws:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch ipc laws.' });
    }

}