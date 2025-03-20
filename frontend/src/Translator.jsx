import { useState, useEffect } from "react";
import axios from "axios";

const Translator = () => {
    const [selectedLang, setSelectedLang] = useState("en");
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isListening, setIsListening] = useState(false);

    // Handle language selection change
    const handleLangChange = (e) => {
        setSelectedLang(e.target.value);
    };

    // Handle text input change
    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    // Handle form submission to request translation
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/translate", {
                text: text,
                target_lang: "en",  // We always want to translate to English
                source_lang: selectedLang
            });
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            console.error("Error translating:", error);
        }
    };

    // Function to start speech recognition
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = selectedLang;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };

        recognition.start();
    };

    // Function to speak the translated text
    const speakTranslatedText = () => {
        if (translatedText) {
            const speech = new SpeechSynthesisUtterance(translatedText);
            speech.lang = "en-US";
            window.speechSynthesis.speak(speech);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
            <h1 className="text-2xl font-bold text-center mb-4">Text Translator</h1>

            <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Select Language</label>
                <select
                    id="language"
                    value={selectedLang}
                    onChange={handleLangChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                </select>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Enter text to translate"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mb-4"
            >
                Translate
            </button>

            {/* Button to start speech recognition */}
            <button
                onClick={startListening}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mb-4"
                disabled={isListening}
            >
                {isListening ? "Listening..." : "Speak to Translate"}
            </button>

            {translatedText && (
                <div className="mt-6 p-4 bg-gray-100 border rounded-md">
                    <h3 className="text-lg font-medium text-gray-700">Translated Text:</h3>
                    <p>{translatedText}</p>

                    {/* Button to speak the translated text */}
                    <button
                        onClick={speakTranslatedText}
                        className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 mt-4"
                    >
                        Listen to Translation
                    </button>
                </div>
            )}
        </div>
    );
};

export default Translator;
