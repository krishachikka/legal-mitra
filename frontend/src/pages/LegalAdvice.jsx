import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { CircularProgress } from "@mui/material";

const LegalAdvice = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchKeywords = async (query) => {
    try {
      const response = await fetch("http://localhost:5001/extract_keywords", {
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

    try {
      // Extract keywords from the search query
      const keywords = await fetchKeywords(query);

      // Send the keywords to the search API to get relevant results
      const response = await fetch(
        `http://localhost:5000/api/v1/search/search?keywords=${JSON.stringify(keywords)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch legal data");
      }

      const data = await response.json();

      // display all fetched data 
      console.log("Raw formed data:" , data);

      // Handle formatting directly here
      const formattedResults = Array.isArray(data)
        ? data.map((item) => ({
            title: item?.title ? item.title.toUpperCase() : "UNKNOWN",
            description: item?.description ? item.description.toUpperCase() : "NO DESCRIPTION",
          }))
        : [];

      setResults(formattedResults);
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

      {/* Results Display */}
      <div className="mt-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, index) => (
              <div
                key={index}
                className="p-5 border border-gray-300 rounded-xl bg-white shadow-md transition duration-300 hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
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
    </div>
  );
};

export default LegalAdvice;