import React, { useState, useEffect } from "react";
import axios from "axios";

const Summarizer = () => {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the article from the local database
    const fetchArticle = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/indian-constitution");
            if (response.data && response.data.length > 0) {
                // Get the first article from the response data
                const article = response.data[3].Articles;
                setInputText(article); // Set the article text as inputText
            }
        } catch (err) {
            setError("Error fetching article data");
        }
    };

    useEffect(() => {
        fetchArticle(); // Fetch the article on component mount
    }, []);

    // Function to summarize the article
    const summarizeText = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.post(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    inputs: inputText, // Use the inputText for summarization
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
                    },
                }
            );
            setSummary(response.data[0].summary_text);
        } catch (err) {
            setError("Error summarizing the text");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Text Summarizer</h1>

            {/* Display the fetched article */}
            <div>
                <h3>Article:</h3>
                <p>{inputText}</p>
            </div>

            <button onClick={summarizeText} disabled={isLoading || !inputText}>
                {isLoading ? "Summarizing..." : "Summarize"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {summary && (
                <div>
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default Summarizer;
