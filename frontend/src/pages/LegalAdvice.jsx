import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { CircularProgress } from "@mui/material";
import PDFresponse from "../components/response";

const LegalAdvice = () => {
  const [results, setResults] = useState([]); // Store search results
  const [summarizedContent, setSummarizedContent] = useState(""); // Store the summarized content
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the query

  // Function to extract keywords from the query
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

      // Now, let's summarize the content
      const contentToSummarize = formattedResults.map((item) => item.description).join("\n");
      const summary = await summarizeContent(contentToSummarize);
      setSummarizedContent(summary); // Update the summarized content
    } catch (error) {
      console.error("Error fetching legal advice:", error);
      setSummarizedContent("Error fetching legal advice."); // Set error message if fetching fails
    }

    setLoading(false); // Set loading to false after fetch is done
  };

  return (
    <div className="p-6 ml-0 md:ml-15 transition-all duration-300 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Legal Advice</h1>

      <div className="mb-6">
        <SearchBar onSearch={fetchLegalAdvice} />
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1">

        {/* Pass searchQuery and automatically trigger submit in PDFresponse */}
        <PDFresponse query={searchQuery} autoSubmit={true} />

        <section>
          {loading && (
            <div className="flex justify-center items-center mt-6">
              <CircularProgress color="primary" />
            </div>
          )}

          {/* Displaying the summary */}
          {summarizedContent && !loading && (
            <div className="p-5 border border-gray-300 rounded-xl bg-white shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary:</h2>
              <p className="text-gray-700 leading-relaxed">{summarizedContent}</p>
            </div>
          )}

          {/* Scrollable results section */}
          <div className="mt-4 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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