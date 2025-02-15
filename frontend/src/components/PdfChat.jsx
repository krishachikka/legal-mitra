import React, { useState } from "react";
import axios from "axios";

const PdfChat = () => {
    const [pdfFiles, setPdfFiles] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setPdfFiles(e.target.files);
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    // Upload PDF Files
    const uploadPdfFiles = async () => {
        const formData = new FormData();
        for (let i = 0; i < pdfFiles.length; i++) {
            formData.append("pdf_files", pdfFiles[i]);
        }

        try {
            await axios.post("http://localhost:8000/upload_pdf/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("PDFs processed successfully!");
        } catch (error) {
            console.error("Error uploading PDF:", error);
        }
    };

    // Ask the question
    const askQuestion = async () => {
        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/ask_question/", {
                question: question, // Correct structure to match backend
            }, {
                headers: {
                    "Content-Type": "application/json", // Ensure the correct content type
                },
            });
            setAnswer(response.data.response); // Display the response from the server
        } catch (error) {
            console.error("Error asking question:", error);
            setAnswer("Error occurred while fetching the answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 mt-4">
            <div className="bg-white/30 backdrop-blur-2xl border-red-900 border-4 p-6 rounded-3xl shadow-lg max-w-2xl w-full">
                <h2 className="text-3xl font-semibold text-center mb-6">Chat using PDF</h2>

                {/* PDF Upload Section */}
                <div className="flex flex-col items-center mb-6">
                    <label className="cursor-pointer bg-red-800 text-white py-2 px-6 rounded-3xl hover:bg-red-900 transform hover:scale-110 transition duration-300 ease-in-out">
                        Select PDF Files
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />
                    </label>
                    {pdfFiles && pdfFiles.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">{pdfFiles.length} file(s) selected</p>
                    )}
                    <button
                        onClick={uploadPdfFiles}
                        disabled={!pdfFiles}
                        className="mt-4 bg-gray-800 text-white py-2 px-6 rounded-3xl hover:bg-gray-700 transform hover:scale-110 disabled:bg-gray-300 transition duration-300 ease-in-out"
                    >
                        Upload and Process PDFs
                    </button>
                </div>

                {/* Question Section */}
                <div className="flex flex-row mx-auto justify-between items-center">
                    <input
                        type="text"
                        className="w-full p-2 border border-yellow-800 rounded-2xl bg-gray-100"
                        placeholder="Ask a question"
                        value={question}
                        onChange={handleQuestionChange}
                        disabled={loading}
                    />
                    <button
                        onClick={askQuestion}
                        disabled={loading}
                        className="mx-2 bg-yellow-600 text-white py-2 px-6 rounded-3xl hover:bg-yellow-700 disabled:bg-gray-300 transform hover:scale-110 transition duration-300 ease-in-out"
                    >
                        {loading ? "Processing..." : "Ask"}
                    </button>
                </div>

                {/* Answer Display */}
                {loading && (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-t-4 border-yellow-600 border-solid rounded-full animate-spin"></div>
                    </div>
                )}
                {!loading && answer && (
                    <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
                        <h3 className="text-xl font-semibold mb-2">Answer:</h3>
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfChat;