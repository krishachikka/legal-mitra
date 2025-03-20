import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { CircularProgress } from "@mui/material";

const LegalAdvice = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");  // To store the summary

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
      return [];
    }
  };

  const fetchLegalAdvice = async (query) => {
    setLoading(true);
    setSummary("");  // Reset summary on new search

    try {
      // Extract keywords from the search query
      const keywords = await fetchKeywords(query);

      // Send the keywords to the search API to get relevant results
      const response = await fetch(
        `${import.meta.env.VITE_NODE_BACKEND_URL}/api/v1/search/search?keywords=${JSON.stringify(keywords)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch legal data");
      }

      const data = await response.json();

      // display all fetched data 
      console.log("Raw formed data:", data);

      // Handle formatting directly here
      const formattedResults = Array.isArray(data)
        ? data.map((item) => ({
          title: item?.title ? item.title.toUpperCase() : "UNKNOWN",
          description: item?.description ? item.description.toUpperCase() : "NO DESCRIPTION",
        }))
        : [];

      setResults(formattedResults);

      // Create a summary of the results (first 5 lines)
      const summaryText = formattedResults.map(item => item.description).slice(0, 5).join(" ");
      setSummary(summaryText);
    } catch (error) {
      console.error("Error fetching legal advice:", error);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 ml-0 md:ml-15 transition-all duration-300 min-h-screen bg-gray-100">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Legal Advice
      </h1>

      {/* Search Bar Component */}
      <div className="mb-6">
        <SearchBar onSearch={fetchLegalAdvice} />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <CircularProgress color="primary" />
        </div>
      )}

      {/* Split Layout: Left for Summary, Right for Cards */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section - Answer Summary */}
        <div className="w-full md:w-1/2 p-6 border rounded-lg bg-white shadow-md h-[300px] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Answer</h2>
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            !loading && (
              <p className="text-gray-500">No summary available. Try searching for legal advice.</p>
            )
          )}
        </div>

        {/* Right Section - Legal Advice Cards */}
        <div className="w-full md:w-1/2">
          {loading ? (
            <div className="flex justify-center items-center mt-6">
              <CircularProgress color="primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 border border-gray-300 rounded-xl bg-white shadow-md transition duration-300 hover:shadow-lg h-[300px]"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                    <p className="text-gray-700 leading-relaxed h-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-lg mt-6">
                  No results found. Try searching with different keywords.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalAdvice;
