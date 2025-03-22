import React, { useState } from "react";
import axios from "axios";

const Summarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const summarizeText = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          inputs: "Yash Chavan is the best person",
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
      <textarea
        rows="6"
        cols="50"
        placeholder="Enter text to summarize"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
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
