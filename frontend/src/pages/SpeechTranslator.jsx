import { useState, useEffect } from 'react';
import axios from 'axios';

const SpeechTranslator = () => {
    const [transcribedText, setTranscribedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('hi');  // Default language: Hindi

    // Check if SpeechRecognition is supported in the browser
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const [speechRecognition, setSpeechRecognition] = useState(null);

    useEffect(() => {
        if (recognition) {
            setSpeechRecognition(new recognition());
        } else {
            setError('Speech Recognition is not supported in this browser.');
        }

        // Cleanup function to stop recognition when the component unmounts
        return () => {
            if (speechRecognition) {
                speechRecognition.stop();
            }
        };
    }, [recognition]);

    useEffect(() => {
        if (speechRecognition) {
            speechRecognition.continuous = true;
            speechRecognition.lang = language;
            speechRecognition.interimResults = true;

            speechRecognition.onresult = (event) => {
                const result = event.results[event.resultIndex];
                const text = result[0].transcript;
                setTranscribedText(text);
            };

            speechRecognition.onerror = (event) => {
                setError('An error occurred during speech recognition.', event);
                setIsListening(false);
            };
        }
    }, [speechRecognition, language]);

    const startListening = () => {
        if (speechRecognition) {
            setIsListening(true);
            speechRecognition.start();
        } else {
            setError('Speech Recognition is not initialized.');
        }
    };

    const stopListening = () => {
        if (speechRecognition) {
            setIsListening(false);
            speechRecognition.stop();
        }
    };

    const handleTranslate = async () => {
        if (!transcribedText) {
            setError('Please provide some text to translate.');
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL_002}/translate`, {
                speech_text: transcribedText,
            });
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            setError('Error while translating the text.', error);
        }
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        if (speechRecognition) {
            speechRecognition.lang = event.target.value;
        }
    };

    return (
        <div className="SpeechTranslator">
            <h2>Speech to Text and Translate</h2>

            <div>
                <select onChange={handleLanguageChange} value={language}>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="te">Telugu</option>
                    <option value="mr">Marathi</option>
                    <option value="ta">Tamil</option>
                    <option value="gu">Gujarati</option>
                    <option value="ml">Malayalam</option>
                    <option value="kn">Kannada</option>
                    <option value="pa">Punjabi</option>
                    <option value="ur">Urdu</option>
                </select>
            </div>

            <div>
                <button onClick={startListening} disabled={isListening}>
                    Start Listening
                </button>
                <button onClick={stopListening} disabled={!isListening}>
                    Stop Listening
                </button>
            </div>

            <div>
                <h3>Transcribed Text</h3>
                <p>{transcribedText || 'No speech detected yet.'}</p>
            </div>

            <div>
                <button onClick={handleTranslate}>Translate</button>
            </div>

            <div>
                {translatedText && (
                    <>
                        <h3>Translated Text</h3>
                        <p>{translatedText}</p>
                    </>
                )}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SpeechTranslator;
