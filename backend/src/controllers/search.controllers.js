import CommonLaws from "../models/dataset_models/commonLaws.models.js";
import WorkerLaws from "../models/dataset_models/workerLaws.models.js";

// Function to search and rank results based on keyword matches
const searchInAllDatasets = async (keywords) => {
  try {
    // Create search conditions for each keyword
    const searchConditions = keywords.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },  // CommonLaws
        { "documents.question": { $regex: keyword, $options: "i" } }, // workerlaws
        { "documents.answer": { $regex: keyword, $options: "i" } }, // workerlaws
      ],
    }));

    // Fetch results from the WorkerLaws and CommonLaws datasets
    const datasets = await Promise.all([
      CommonLaws.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'CommonLaws' }))),
      WorkerLaws.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'WorkerLaws' }))),
    ]);

    // Flatten all dataset results into a single array
    let allResults = datasets.flat();

    // Scoring the results based on the number of keyword matches
    const scoredResults = allResults
      .map((item) => {
        const titleMatches = keywords.filter((kw) =>
          item.Title?.toLowerCase().includes(kw.toLowerCase()) // Use 'Title' with uppercase "T"
        ).length;

        const documentsMatches = item.documents ? item.documents.reduce((acc, doc) => {
          const questionMatches = keywords.filter((kw) =>
            doc.question?.toLowerCase().includes(kw.toLowerCase())
          ).length;

          const answerMatches = keywords.filter((kw) =>
            doc.answer?.toLowerCase().includes(kw.toLowerCase())
          ).length;

          return acc + questionMatches + answerMatches;
        }, 0) : 0;  // Added check for 'documents' field in CommonLaws

        const descriptionMatches = keywords.filter((kw) =>
          item.description?.toLowerCase().includes(kw.toLowerCase())  // Added for CommonLaws
        ).length;

        const totalMatches = titleMatches + documentsMatches + descriptionMatches;
        return { ...item, score: totalMatches };
      })
      .filter((item) => item.score > 0) // Only include items with matches
      .sort((a, b) => b.score - a.score) // Sort by score
      .slice(0, 10); // Limit to the top 10 results

    return scoredResults;
  } catch (error) {
    console.error("Error searching datasets:", error);
    throw new Error("Error searching datasets");
  }
};

const search = async (req, res) => {
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ message: "Keywords are required" });
  }

  try {
    // Parse keywords from query string
    const parsedKeywords = JSON.parse(keywords);

    // Get search results from all datasets
    const results = await searchInAllDatasets(parsedKeywords);

    // Format the results, including dataset info and content
    const formattedResults = results.map((item) => ({
      title: item.Title || item.title, // Title can be from either dataset
      description: item.description || item.documents.map(doc => `${doc.question}: ${doc.answer}`).join("\n"), // Handle description formatting for both
      dataset: item.dataset || "Unknown Dataset", // Add dataset info
    }));

    // Send the formatted results back to the frontend
    res.json(formattedResults);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Error during search" });
  }
};

export { search };
