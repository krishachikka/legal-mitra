import React, { useState, useEffect } from "react";
import axios from "axios";

// Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const Summarizer = ({ inputText }) => {
    const [summary, setSummary] = useState(""); // Resulting summary
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    const summarizeText = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Add a delay before calling the API to avoid rate limiting or timeouts
            await delay(2000); // Adjust delay if necessary

            // Chunk the input text if it's too long
            const textChunks = chunkText(inputText);

            // Array to collect all summaries
            let allSummaries = [];
            for (let chunk of textChunks) {
                const response = await axios.post(
                    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                    { inputs: chunk },
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`, // Your Hugging Face API key
                        },
                    }
                );

                // Check if the response contains a valid summary
                if (response.data && response.data[0] && response.data[0].summary_text) {
                    allSummaries.push(response.data[0].summary_text); // Append summary to the array
                }
            }

            // Combine all summaries and ensure that it’s within 4 lines (or approx. 4 lines worth of text)
            let combinedSummary = allSummaries.join(" ");

            // Limit the summary to 4 lines by keeping the first 4 sentences or 4 lines worth of text
            const lines = combinedSummary.split("."); // Split by periods to break into sentences
            const limitedSummary = lines.slice(0, 4).join(".") + "."; // Keep only the first 4 sentences

            // Update state with the final trimmed summary
            setSummary(limitedSummary);

        } catch (err) {
            // Log detailed error
            console.error("Error during summarization:", err);
            setError("Error summarizing the text: " + (err.response ? err.response.data : err.message));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (inputText) {
            summarizeText(); // Automatically trigger summarization when new inputText is provided
        }
    }, [inputText]);

    return (
        <div>
            {isLoading ? (
                <p>Summarizing...</p>
            ) : (
                <div>
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Summarizer;