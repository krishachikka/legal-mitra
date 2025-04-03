import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function PDFresponse({ query, autoSubmit, setPdfResponse }) {
  const [question, setQuestion] = useState(query); // Set question from the query prop
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [translatedResponse, setTranslatedResponse] = useState(""); // To store translated response
  const [selectedLang, setSelectedLang] = useState("en"); // Language selection state

  useEffect(() => {
    // Only update question if query changes
    if (query.trim() !== question.trim()) {
      setQuestion(query);
    }

    // If autoSubmit is true, automatically submit the query
    if (autoSubmit && query.trim()) {
      handleSubmit(query);
    }
  }, [query, autoSubmit]);

  // Function to handle translation of response
  const translateResponse = async (responseText) => {
    try {
      const res = await axios.post("http://localhost:8000/translate", {
        text: responseText,
        target_lang: selectedLang,
        source_lang: "en", // Always translate from English
      });
      setTranslatedResponse(res.data.translated_text);
    } catch (error) {
      console.error("Error translating response:", error);
      setTranslatedResponse("Error translating the response.");
    }
  };

  const handleSubmit = async (inputQuestion) => {
    const finalQuestion = inputQuestion || question;

    if (!finalQuestion.trim()) {
      setError("Please enter a question");
      return;
    }

    setIsLoading(true);
    setResponse("Thinking...");
    setError("");

    try {
      console.log("Sending question:", finalQuestion);
      const res = await axios.post("http://localhost:8000/ask-question/", {
        question: finalQuestion,
      });
      console.log("Received response:", res.data);
      setResponse(res.data.response);

      // Send response to LegalAdvice component
      setPdfResponse(res.data.response);

      // Trigger translation once the response is received
      translateResponse(res.data.response);

    } catch (error) {
      console.error("Error:", error);
      setError(
        `Error: ${error.response?.data?.detail || error.message}`
      );
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-2 max-w-4xl">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ask a question about legal documents"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-3xl"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {isLoading && (
          <button
            disabled
            className="bg-blue-600 text-white py-2 px-6 rounded-3xl hover:bg-blue-700 disabled:bg-gray-400"
          >
            Processing...
          </button>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-3xl">
            {error}
          </div>
        )}

        {/* Show the translated response */}
        {translatedResponse && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Complete Response:</h3>
            <div className="bg-red-100/50 p-4 rounded-xl border-2 border-slate-200 max-h-120 overflow-y-auto">
              <ReactMarkdown>
                {translatedResponse}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Show the original response */}
        {response && !translatedResponse && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <div className="bg-red-100/50 p-4 rounded-xl border-2 border-slate-200 max-h-120 overflow-y-auto">
              <ReactMarkdown>
                {response}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Language Dropdown */}
      <div className="mt-4">
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
    </div>
  );
}

export default PDFresponse;
