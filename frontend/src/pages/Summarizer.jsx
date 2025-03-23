import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { CircularProgress } from "@mui/material";

const Summarizer = () => {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    const fetchKeywords = async (query) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PYTHON_BACKEND_URL_001}/extract_keywords`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) throw new Error("Failed to extract keywords");

            const data = await response.json();
            const keywords = data.keywords;

            console.log("Extracted Keywords:", keywords);

            return keywords;
        } catch (error) {
            setError("Error extracting keywords.");
            return [];
        }
    };

    const fetchLegalData = async (keywords) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_NODE_BACKEND_URL}/api/v1/search/search?keywords=${JSON.stringify(keywords)}`
            );

            if (!response.ok) throw new Error("Failed to fetch legal data");

            const data = await response.json();
            return data[0];
        } catch (error) {
            setError("Error fetching legal data.");
            return null;
        }
    };

    const summarizeText = async (text) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.post(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                { inputs: text },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
                    },
                }
            );

            setSummary(response.data[0].summary_text);
        } catch (err) {
            setError("Error summarizing the text.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setIsLoading(true);
        setSummary("");

        try {
            const keywords = await fetchKeywords(query);
            console.log("Keywords used for search:", keywords);
            const result = await fetchLegalData(keywords);

            if (result && result.description) {
                setResults([result]);
                await summarizeText(result.description);
            } else {
                setError("No relevant legal data found.");
            }
        } catch (error) {
            setError("Error performing search.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-red-900">Legal Text Summarizer</h1>

            <div className="mb-6">
                <SearchBar onSearch={handleSearch} />
            </div>

            {isLoading && (
                <div className="flex justify-center items-center mt-6">
                    <CircularProgress color="primary" />
                </div>
            )}

            {results.length > 0 && !isLoading && (
                <div className="bg-white border-2 border-red-900 shadow-lg shadow-red-950 rounded-3xl p-6 mb-4">
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Article:</h3>
                    <p className="text-gray-700">{results[0].description}</p>
                </div>
            )}

            {summary && !isLoading && (
                <div className="bg-white border-2 border-red-900 shadow-lg shadow-red-950 rounded-3xl p-6">
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Summary:</h3>
                    <p className="text-gray-700">{summary}</p>
                </div>
            )}

            {error && (
                <p className="text-center text-red-500 mt-4">{error}</p>
            )}
        </div>
    );
};

export default Summarizer;