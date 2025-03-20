import WorkerLaw from "../../models/dataset_models/workerLaws.models.js"


export const getWorkerLaws = async (req, res) => {
    try {
        // Fetch all common laws from the collection
        const laws = await WorkerLaw.find();

        // If no laws are found
        if (!laws.length) {
            return res.status(404).json({ message: 'No worker laws found.' });
        }

        // Send the laws as a response
        return res.status(200).json(laws);
    } catch (error) {
        console.error('Error fetching worker laws:', error.message);
        return res.status(500).json({ message: 'Server error, unable to fetch worker laws.' });
    }
}