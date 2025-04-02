import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");  // Language selection state
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      speechRecognition.lang = selectedLang; // Set speech recognition to selected language
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;

      setRecognition(speechRecognition);

      speechRecognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setQuery(transcript.trim());
      };

      speechRecognition.onstart = () => {
        setIsListening(true);
        setQuery(""); // Clear previous query when starting again
      };

      speechRecognition.onend = () => setIsListening(false);
    } else {
      console.error("Speech Recognition API is not supported in this browser.");
    }
  }, [selectedLang]);

  // Start listening
  const startListening = () => {
    if (recognition) {
      setQuery(""); // Clear previous query before starting
      recognition.start();
    } else {
      alert("Speech Recognition is not supported in your browser.");
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  // Handle language selection change
  const handleLangChange = (e) => {
    setSelectedLang(e.target.value);
  };

  // Handle text input change
  const handleTextChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle form submission to request translation
  const handleTranslate = async () => {
    try {
      const response = await axios.post("http://localhost:5173/translate", {
        text: query,
        target_lang: "en",  // Always translate to English
        source_lang: selectedLang
      });
      setTranslatedText(response.data.translated_text);
      setQuery(response.data.translated_text);  // Automatically set the translated text in the search query
    } catch (error) {
      console.error("Error translating:", error);
    }
  };

  return (
    <div className="relative flex items-center w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md shadow-md shadow-red-300/50 rounded-full p-1 transition-all duration-300 hover:shadow-lg">
      {/* Language selection dropdown */}
      <div className="mr-2">
        <select
          value={selectedLang}
          onChange={handleLangChange}
          className="p-2 border border-gray-300 rounded-3xl shadow-sm"
        >
          <option className="bg-red-200/50 hover:bg-red-900" value="en">English</option>
          <option className="bg-red-200/50 hover:bg-red-900" value="hi">Hindi</option>
          <option className="bg-red-200/50 hover:bg-red-900" value="mr">Marathi</option>
        </select>
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter text to translate or search..."
        value={query}
        onChange={handleTextChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            stopListening(); // Stop mic on Enter
            onSearch(query); // Pass query to the parent on search
          }
        }}
        className="w-full px-4 py-2 text-gray-700 bg-transparent outline-none rounded-full"
      />

      {/* Search Button */}
      <button
        onClick={() => onSearch(query)} // Pass query to the parent on search
        className="p-2 text-gray-600 hover:text-black transition cursor-pointer"
      >
        <SearchIcon />
      </button>

      {/* Mic Button */}
      <button
        onClick={startListening}
        className={`p-2 transition rounded-full cursor-pointer ${isListening ? "text-blue-600 animate-pulse" : "text-gray-600 hover:text-black"}`}
      >
        <MicIcon />
      </button>

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        className="p-2 text-red-800 hover:text-red-950 transition cursor-pointer ml-2 font-bold"
      >
        Translate
      </button>

      {/* If translation is available, display it */}
      {translatedText && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <strong>Translated Text:</strong> {translatedText}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
