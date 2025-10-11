import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

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
      const res = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL_003}/translate`, {
        text: responseText,
        target_lang: selectedLang,
        source_lang: "en", // Always translate from English
      });

      // Remove "**" symbols from the translated text to prevent bold formatting
      const cleanedText = res.data.translated_text.replace(/\*\*/g, "");
      setTranslatedResponse(cleanedText);
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
      const res = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL_003}/ask-question/`, {
        question: finalQuestion,
      });
      console.log("Received response:", res.data);

      // Remove "**" symbols from the response to prevent bold formatting
      const cleanedResponse = res.data.response.replace(/\*\*/g, "");
      setResponse(cleanedResponse);

      // Send response to LegalAdvice component
      setPdfResponse(cleanedResponse);

      // Trigger translation once the response is received
      translateResponse(cleanedResponse);

    } catch (error) {
      console.error("Error:", error);
      setError(`Error: ${error.response?.data?.detail || error.message}`);
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  // Conditionally apply the font style if language is not English
  const fontStyle = selectedLang !== "en" ? "font-marathi" : "";

  return (
    <div className="container mx-auto p-2 max-w-4xl">
      <div className="bg-gray-100 p-4 rounded-3xl">
        <div className="mb-4 hidden">
          <input
            type="text"
            placeholder="Ask a question about legal documents"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-3xl"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-6 rounded-3xl hover:bg-blue-700 disabled:bg-gray-400 hidden"
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-3xl">
            {error}
          </div>
        )}

        {/* Show the translated response */}
        {translatedResponse && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Complete Response:</h3>
            <div className={`bg-red-50 shadow-md shadow-red-950 rounded-3xl p-6 transition duration-300 hover:shadow-lg max-h-120 overflow-y-auto ${fontStyle}`}>
              {/* Use plain div instead of ReactMarkdown to avoid formatting */}
              <div>{translatedResponse}</div>
            </div>
          </div>
        )}

        {/* Show the original response */}
        {response && !translatedResponse && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <div className={`bg-red-50 shadow-md shadow-red-950 rounded-3xl p-6 transition duration-300 hover:shadow-lg max-h-120 overflow-y-auto ${fontStyle}`}>
              {/* Use plain div instead of ReactMarkdown to avoid formatting */}
              <div>{response}</div>
            </div>
          </div>
        )}
      </div>

      {/* Language Dropdown */}
      <div className="mt-4">
        <select
          className="border border-gray-400 rounded-3xl p-2"
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

// PropTypes for validation
PDFresponse.propTypes = {
  query: PropTypes.string.isRequired, // The query string passed to the component
  autoSubmit: PropTypes.bool.isRequired, // The boolean indicating auto-submit
  setPdfResponse: PropTypes.func.isRequired, // The function to handle setting the PDF response
};

export default PDFresponse;
