import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { CircularProgress } from "@mui/material";
import PDFresponse from "../components/response";

const LegalAdvice = () => {
  const [results, setResults] = useState([]); // Store search results
  const [summarizedContent, setSummarizedContent] = useState(""); // Store the summarized content
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the query
  const [pdfResponse, setPdfResponse] = useState(""); // State to hold the response from PDFresponse
  const [selectedLang, setSelectedLang] = useState("en"); // Language selection state
  const [translatedSummary, setTranslatedSummary] = useState(""); // Store translated summary

  // Function to fetch keywords from the query
  const fetchKeywords = async (query) => {
    try {
      const response = await axios.post("http://localhost:8000/extract_keywords", {
        query,
      });
      // Log the extracted keywords
      console.log("Extracted Keywords:", response.data.keywords);
      return response.data.keywords || [];
    } catch (error) {
      console.error("Keyword extraction error:", error);
      return [];
    }
  };

  // Summarize text by chunking and using Hugging Face model for summarization
  const summarizeText = async (text) => {
    const chunkText = (text, maxLength = 1024) => {
      const words = text.split(" ");
      const chunks = [];
      let currentChunk = "";

      words.forEach((word) => {
        if ((currentChunk + " " + word).length > maxLength) {
          chunks.push(currentChunk);
          currentChunk = word;
        } else {
          currentChunk += " " + word;
        }
      });

      if (currentChunk) chunks.push(currentChunk);
      return chunks;
    };

    const textChunks = chunkText(text);
    const limitedChunks = textChunks.slice(0, 5);

    try {
      const allSummaries = await Promise.all(
        limitedChunks.map((chunk) =>
          axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: chunk },
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
              },
            }
          )
        )
      );

      const summaries = allSummaries
        .map((response) => response.data[0].summary_text)
        .filter(Boolean);

      const combinedSummary = summaries.join(" ");
      const lines = combinedSummary.split(".");
      const limitedSummary = lines.slice(0, 8).join(".") + ".";

      setSummarizedContent(limitedSummary);
      translateSummary(limitedSummary); // Trigger translation after summarization
    } catch (err) {
      console.error("Error during summarization:", err);
      setSummarizedContent("Error summarizing the text.");
    }
  };

  // Translate the summarized content based on selected language
  const translateSummary = async (text) => {
    try {
      const response = await axios.post("http://localhost:8000/translate", {
        text: text,
        target_lang: selectedLang,
        source_lang: "en", // Always translate from English
      });
      setTranslatedSummary(response.data.translated_text);
    } catch (error) {
      console.error("Error translating summary:", error);
    }
  };

  // Function to fetch legal advice data
  const fetchLegalAdvice = async (query) => {
    setLoading(true);
    setSummarizedContent(""); // Reset the summary content before a new query
    setSearchQuery(query); // Update the search query

    try {
      // Extract keywords from the search query
      const keywords = await fetchKeywords(query);

      // Fetch legal data from Firipc dataset using the extracted keywords
      const response = await fetch(
        `${import.meta.env.VITE_NODE_BACKEND_URL}/api/v1/search/search?keywords=${JSON.stringify(keywords)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch legal data");
      }

      const data = await response.json();
      console.log("Search Results Data:", data);

      // Handle formatting directly here for Firipc data
      const formattedResults = Array.isArray(data)
        ? data.map((item) => ({
          title: item.title || "UNKNOWN", // Use offense as title
          description: item.description || "NO DESCRIPTION",
          punishment: item.punishment || "NO PUNISHMENT",
          url: item.url || "No URL", // Use URL if available
          dataset: item.dataset || "Firipc Dataset",
        }))
        : [];

      console.log(formattedResults);

      setResults(formattedResults); // Set the formatted results

      // Prepare content for summarization
      const contentToSummarize = formattedResults.map((item) => item.description).join("\n");

      // Add the PDFresponse content to the content to summarize
      const combinedContent = contentToSummarize + "\n" + pdfResponse;

      console.log("Content to summarize (includes PDF response):", combinedContent);

      // Call the summarizeText function to get the summarized content
      await summarizeText(combinedContent);

    } catch (error) {
      console.error("Error fetching legal advice:", error);
      setSummarizedContent("Error fetching legal advice."); // Set error message if fetching fails
    }

    setLoading(false); // Set loading to false after fetch is done
  };

  // Effect to trigger summarization after both results and PDF response are available
  useEffect(() => {
    if (results.length > 0 && pdfResponse) {
      const contentToSummarize = results
        .map((item) => item.description)
        .join("\n");
      const combinedContent = contentToSummarize + "\n" + pdfResponse;
      summarizeText(combinedContent);
    }
  }, [pdfResponse, results]);

  // Handle PDF file upload
  const handlePdfUpload = async (pdfFiles) => {
    const formData = new FormData();
    pdfFiles.forEach((file) => formData.append("pdf_files", file));

    try {
      const response = await axios.post("http://localhost:8000/upload_pdf/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data); // Handle PDF response if needed
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <div className="p-6 ml-0 md:ml-15 transition-all duration-300 min-h-screen bg-gradient-to-r from-gray-300 to-red-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Legal Advice</h1>

      <div className="mb-2">
        <SearchBar onSearch={fetchLegalAdvice} selectedLang={selectedLang} />
      </div>

      {/* Language Dropdown */}
      <div className="mb-2">
        <select
          className="border border-gray-400 rounded-3xl p-2"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="pa">Punjabi</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-6">
          <CircularProgress color="red" />
        </div>
      )}

      {/* Only show translated summary */}
      {translatedSummary && !loading && (
        <div className="p-5 border border-gray-300 rounded-xl bg-white shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Summarized Answer:</h2>
          <p>{translatedSummary}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 grid-cols-1 response">
        {/* Pass searchQuery and automatically trigger submit in PDFresponse */}
        <PDFresponse query={searchQuery} autoSubmit={true} setPdfResponse={setPdfResponse} />

        <section>
          <div className="mt-4 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Related Articles:</h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-4 rounded-3xl max-h-150 overflow-y-auto">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="bg-red-50 shadow-lg shadow-red-950 rounded-3xl p-6 transition duration-300 hover:shadow-lg"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>

                    <p className="text-gray-700 leading-relaxed description-line-clamp">
                      {item.description}
                    </p>
                    <p className="text-gray-500 text-sm">Source: {item.dataset}</p>
                    {item.punishment && item.punishment !== "NO PUNISHMENT" && (
                      <p className="text-gray-500 text-sm">Punishment: {item.punishment}</p>
                    )}
                    {item.url && item.url !== "No URL" && (
                      <p className="text-red-900 font-bold text-sm">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">Link</a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LegalAdvice;
