import CommonLaws from "../models/dataset_models/commonLaws.models.js";
import WorkerLaws from "../models/dataset_models/workerLaws.models.js";
import Firipc from "../models/dataset_models/firIPC.models.js";
import IndianConstitution from "../models/dataset_models/indianConstitution.models.js";
import LegalQNA from "../models/dataset_models/quesAndAns.models.js"; // Corrected model import

// Function to search and rank results based on keyword matches across all datasets
const searchInAllDatasets = async (keywords) => {
  try {
    // Create search conditions for each keyword
    const searchConditions = keywords.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }, // CommonLaws
        { "documents.question": { $regex: keyword, $options: "i" } }, // WorkerLaws
        { "documents.answer": { $regex: keyword, $options: "i" } }, // WorkerLaws
        { Offense: { $regex: keyword, $options: "i" } }, // Firipc
        { Description: { $regex: keyword, $options: "i" } }, // Firipc
        { Punishment: { $regex: keyword, $options: "i" } }, // Firipc
        { Articles: { $regex: keyword, $options: "i" } }, // Indian Constitution (Articles)
        { question: { $regex: keyword, $options: "i" } }, // LegalQNA - question matching
        { answer: { $regex: keyword, $options: "i" } }, // LegalQNA - answer matching
      ],
    }));

    // Fetch results from all datasets, including LegalQNA
    const datasets = await Promise.all([
      CommonLaws.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'CommonLaws' }))),
      WorkerLaws.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'WorkerLaws' }))),
      Firipc.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'Firipc' }))),
      IndianConstitution.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'IndianConstitution' }))),
      LegalQNA.find({ $or: searchConditions }).then(results => results.map(item => ({ ...item.toObject(), dataset: 'LegalQNA' }))), // Fetch LegalQNA data
    ]);

    // Flatten all dataset results into a single array
    let allResults = datasets.flat();

    // Scoring the results based on the number of keyword matches
    const scoredResults = allResults
      .map((item) => {
        const titleMatches = keywords.filter((kw) =>
          item.Title?.toLowerCase().includes(kw.toLowerCase())
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

        const offenseMatches = keywords.filter((kw) =>
          item.Offense?.toLowerCase().includes(kw.toLowerCase())  // Firipc Offense matching
        ).length;

        const punishmentMatches = keywords.filter((kw) =>
          item.Punishment?.toLowerCase().includes(kw.toLowerCase())  // Firipc Punishment matching
        ).length;

        const articlesMatches = keywords.filter((kw) =>
          item.Articles?.toLowerCase().includes(kw.toLowerCase())  // Indian Constitution Articles matching
        ).length;

        const questionMatches = keywords.filter((kw) =>
          item.question?.toLowerCase().includes(kw.toLowerCase())  // LegalQNA Question matching
        ).length;

        const answerMatches = keywords.filter((kw) =>
          item.answer?.toLowerCase().includes(kw.toLowerCase())  // LegalQNA Answer matching
        ).length;

        const totalMatches = titleMatches + documentsMatches + descriptionMatches + offenseMatches + punishmentMatches + articlesMatches + questionMatches + answerMatches;
        return { ...item, score: totalMatches };
      })
      .filter((item) => item.score > 0) // Only include items with matches
      .sort((a, b) => b.score - a.score) // Sort by score
      .slice(0, 30); // Limit to the top 30 results

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
    const formattedResults = results.map((item) => {
      if (item.dataset === 'CommonLaws' || item.dataset === 'WorkerLaws') {
        return {
          title: item.Title || item.title, // Title can be from either dataset
          description: item.description || item.documents.map(doc => `${doc.question}: ${doc.answer}`).join("\n"), // Handle description formatting for both
          dataset: item.dataset || "Unknown Dataset",
        };
      } else if (item.dataset === 'Firipc') {
        return {
          title: item.Offense, // Firipc - Offense as the title
          description: item.Description,
          punishment: item.Punishment,
          dataset: item.dataset || "Unknown Dataset",
          url: item.URL,
        };
      } else if (item.dataset === 'IndianConstitution') {
        // Extract the article number from the Articles field
        const articleNumber = item.Articles.split(".")[0].trim();
        return {
          title: `Article ${articleNumber}`,
          description: item.Articles, // Full article text
          dataset: item.dataset || "Unknown Dataset",
        };
      } else if (item.dataset === 'LegalQNA') {
        return {
          title: item.question, // LegalQNA - directly use the question as the title
          description: item.answer, // Use the answer as the description
          dataset: item.dataset || "Unknown Dataset",
        };
      } else {
        return {}; // Return an empty object if dataset is unknown
      }
    });

    // Send the formatted results back to the frontend
    res.json(formattedResults);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Error during search" });
  }
};

export { search };
