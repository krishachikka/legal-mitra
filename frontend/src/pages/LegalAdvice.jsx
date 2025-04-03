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
      const response = await fetch(`${import.meta.env.VITE_PYTHON_BACKEND_URL_001}/extract_keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Failed to extract keywords");

      const data = await response.json();
      console.log("Extracted Keywords:", data.keywords);
      return data.keywords;
    } catch (error) {
      console.error("Keyword extraction error:", error);
      return []; // Return an empty array if error occurs
    }
  };

  const summarizeText = async (text) => {
    // Function to chunk long texts into smaller pieces
    const chunkText = (text, maxLength = 1024) => {
      const words = text.split(' ');
      const chunks = [];
      let currentChunk = '';

      words.forEach(word => {
        if ((currentChunk + ' ' + word).length > maxLength) {
          chunks.push(currentChunk);
          currentChunk = word;
        } else {
          currentChunk += ' ' + word;
        }
      });

      if (currentChunk) chunks.push(currentChunk);
      return chunks;
    };

    const textChunks = chunkText(text);

    // Limit to a maximum number of chunks (if desired, e.g., 5 chunks max)
    const limitedChunks = textChunks.slice(0, 5); // You can change this value based on needs

    try {
      // Use Promise.all to send requests in parallel
      const allSummaries = await Promise.all(
        limitedChunks.map(chunk =>
          axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: chunk },
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`, // Your Hugging Face API key
              },
            }
          )
        )
      );

      // Collect all summaries from responses
      const summaries = allSummaries.map(response => response.data[0].summary_text).filter(Boolean);

      // Combine all summaries and ensure that it’s within 4 lines (or approx. 4 lines worth of text)
      let combinedSummary = summaries.join(" ");

      // Limit the summary to 4 lines by keeping the first 4 sentences or 4 lines worth of text
      const lines = combinedSummary.split("."); // Split by periods to break into sentences
      const limitedSummary = lines.slice(0, 8).join(".") + "."; // Keep only the first 4 sentences

      // Update state with the final trimmed summary
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
      const response = await axios.post("http://localhost:5003/translate", {
        text: text,
        target_lang: selectedLang, // Translate based on the selected language
        source_lang: "en" // Always translate from English
      });
      setTranslatedSummary(response.data.translated_text);
    } catch (error) {
      console.error("Error translating summary:", error);
    }
  };

  // Function to fetch legal advice data from Firipc dataset
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

    } catch (error) {
      console.error("Error fetching legal advice:", error);
      setSummarizedContent("Error fetching legal advice."); // Set error message if fetching fails
    }

    setLoading(false); // Set loading to false after fetch is done
  };

  // Effect to trigger summarization only after both results and pdfResponse are set
  useEffect(() => {
    if (results.length > 0 && pdfResponse) {
      // Combine descriptions from results and PDF response
      const contentToSummarize = results
        .map((item) => item.description)
        .join("\n");
      const combinedContent = contentToSummarize + "\n" + pdfResponse;
      console.log("Content to summarize (includes PDF response):", combinedContent);
      summarizeText(combinedContent);
    }
  }, [pdfResponse, results]); // Trigger summarization when pdfResponse or results change

  return (
    <div className="p-6 ml-0 md:ml-15 transition-all duration-300 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Legal Advice</h1>

      <div className="mb-6">
        <SearchBar onSearch={fetchLegalAdvice} />
      </div>

      {/* Language Dropdown */}
      <div className="mb-6">
        <select
          className="border border-gray-300 rounded-md p-2"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Translated Summary:</h2>
          <p>{translatedSummary}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 grid-cols-1">
        {/* Pass searchQuery and automatically trigger submit in PDFresponse */}
        <PDFresponse query={searchQuery} autoSubmit={true} setPdfResponse={setPdfResponse} />

        <section>
          {/* Scrollable results section */}
          <div className="mt-4 max-h-150 overflow-y-auto">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 rounded-xl bg-red-100/50 shadow-md transition duration-300 hover:shadow-lg"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>

                    {/* Clipping the description to 4 lines */}
                    <p className="text-gray-700 leading-relaxed description-line-clamp">
                      {item.description}
                    </p>
                    <p className="text-gray-500 text-sm">Source: {item.dataset}</p>
                    {item.punishment !== "NO PUNISHMENT" && (
                      <p className="text-gray-500 text-sm">Punishment: {item.punishment}</p>
                    )}
                    {item.url !== "No URL" && (
                      <p className="text-blue-500 text-sm">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">Link</a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-gray-500 text-center text-lg mt-6">
                  No results found. Try searching with different keywords.
                </p>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LegalAdvice;
