import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      speechRecognition.lang = "en-IN"; // Indian English
      speechRecognition.continuous = true; // Keep listening while speaking
      speechRecognition.interimResults = true; // Show partial results

      setRecognition(speechRecognition);

      speechRecognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setQuery(transcript.trim()); // Update search bar live
      };

      speechRecognition.onstart = () => {
        setIsListening(true);
        setQuery(""); // Clear previous search when starting again
      };

      speechRecognition.onend = () => setIsListening(false);
    } else {
      console.error("Speech Recognition API is not supported in this browser.");
    }
  }, []);

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

  return (
    <div className="relative flex items-center w-full max-w-lg mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-full p-1 transition-all duration-300 hover:shadow-xl">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search legal topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            stopListening(); // Stop mic on Enter
            onSearch(query); // Pass query to the parent
          }
        }}
        className="w-full px-4 py-2 text-gray-700 bg-transparent outline-none rounded-full"
      />

      {/* Search Button */}
      <button
        onClick={() => onSearch(query)} // Pass query to the parent
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
    </div>
  );
};

export default SearchBar;