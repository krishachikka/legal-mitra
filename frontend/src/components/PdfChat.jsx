import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PdfChat = () => {
    const [pdfFiles, setPdfFiles] = useState(null);
    const [uploadedPdfs, setUploadedPdfs] = useState([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false); // Correct duplicate state
    const [questionHistory, setQuestionHistory] = useState([]);
    const [firstPdfUploaded, setFirstPdfUploaded] = useState(false);
    const [firstQuestionAsked, setFirstQuestionAsked] = useState(false);

    const chatEndRef = useRef(null);
    const answerStartRef = useRef(null);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("questionHistory")) || [];
        const savedPdfs = JSON.parse(localStorage.getItem("uploadedPdfs")) || [];

        setQuestionHistory(savedHistory);
        setUploadedPdfs(savedPdfs);
    }, []);

    useEffect(() => {
        if (questionHistory.length > 0) {
            if (answer && answer.length > 200) {
                answerStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [questionHistory, answer]);

    const handleFileChange = (e) => {
        setPdfFiles(e.target.files);
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const uploadPdfFiles = async () => {
        setPdfLoading(true);
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
            const pdfFileNames = Array.from(pdfFiles).map(file => file.name);
            const updatedPdfs = [...uploadedPdfs, ...pdfFileNames];
            setUploadedPdfs(updatedPdfs);
            setFirstPdfUploaded(true); // Mark first PDF uploaded
            localStorage.setItem("uploadedPdfs", JSON.stringify(updatedPdfs));
            alert("PDFs processed successfully!");
        } catch (error) {
            console.error("Error uploading PDF:", error);
        } finally {
            setPdfLoading(false);
        }
    };

    const askQuestion = async () => {
        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await axios.post("http://localhost:8000/ask_question/", {
                question: question,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    


            // Add the question and answer to the history
            const updatedHistory = [...questionHistory, { question, answer: response.data.response }];
            setQuestionHistory(updatedHistory);
    
            // Save the updated question history to localStorage
            localStorage.setItem("questionHistory", JSON.stringify(updatedHistory));
    

            setFirstQuestionAsked(true);
        } catch (error) {
            console.error("Error asking question:", error);
            setAnswer("Error occurred while fetching the answer.");
        } finally {
            setLoading(false);
        }
    
        setQuestion("");
    };
    

    const clearQuestionHistory = () => {
        if (window.confirm("Are you sure you want to clear all question history?")) {
            setQuestionHistory([]);
            localStorage.removeItem("questionHistory");
        }
    };

    const removePdf = (pdfName) => {
        if (window.confirm("Are you sure you want to remove this PDF?")) {
            const updatedPdfs = uploadedPdfs.filter(name => name !== pdfName);
            setUploadedPdfs(updatedPdfs);
            localStorage.setItem("uploadedPdfs", JSON.stringify(updatedPdfs));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            askQuestion();
        }
    };

    return (
        <div className="flex h-screen max-h-screen bg-gray-100">
            {/* Left Sidebar for PDF Queue and Question History */}
            <div className="w-1/4 bg-white p-6 border-r border-gray-300">
                {/* PDF Queue Section */}
                <h3 className="text-2xl font-semibold mb-4">Uploaded PDFs</h3>
                <ul className="space-y-2 bg-gray-200 p-2 rounded-xl">
                    {uploadedPdfs.length === 0 ? (
                        <p>No PDFs uploaded</p>
                    ) : (
                        uploadedPdfs.map((pdfName, index) => (
                            <li key={index} className="p-2 bg-white rounded-md flex justify-between items-center">
                                {pdfName}
                                <button
                                    onClick={() => removePdf(pdfName)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    &#10005;
                                </button>
                            </li>
                        ))
                    )}
                </ul>

                {/* Question History Section */}
                <h3 className="text-xl font-semibold mt-6 mb-4">Question History</h3>
                <section className="max-h-1/3 overflow-y-auto bg-gray-200 p-2 rounded-xl">
                    <ul className="space-y-2">
                        {questionHistory.length === 0 ? (
                            <p>No questions asked yet.</p>
                        ) : (
                            questionHistory.map((history, index) => (
                                <li key={index} className="p-2 bg-white rounded-md">
                                    <strong>Que: </strong>{history.question}
                                </li>
                            ))
                        )}
                    </ul>
                </section>

                {/* Clear Button */}
                {questionHistory.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={clearQuestionHistory}
                            className="w-full py-2 px-4 bg-red-800 text-white rounded-3xl hover:bg-red-900"
                        >
                            Clear Questions
                        </button>
                    </div>
                )}

                {/* PDF Upload Section */}
                <div className="mt-6">
                    <label className="cursor-pointer bg-red-900 text-white py-2 px-6 rounded-3xl hover:bg-red-800 transform hover:scale-110 transition duration-300 ease-in-out">
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
                    {pdfFiles && pdfFiles.length > 0 && (
                        <button
                            onClick={uploadPdfFiles}
                            disabled={!pdfFiles}
                            className="relative bg-gray-800 text-white py-2 px-6 rounded-3xl hover:bg-gray-700 transform hover:scale-110 disabled:bg-gray-300 transition duration-300 ease-in-out"
                        >
                            {pdfLoading ? (
                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-t-4 border-yellow-600 border-solid rounded-full animate-spin"></div>
                            ) : (
                                "Upload and Process PDFs"
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Section */}
            <div className="flex-1 bg-gray-200 p-4">
                {/* Chat History Section */}
                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto p-8">
                    {questionHistory.map((history, index) => (
                        <div key={index} className="mb-2">
                            {/* Question Section (Right side) */}
                            <div className="flex justify-end">
                                <div className="bg-gray-300 p-3 rounded-3xl min-w-s max-w-xl text-sm">
                                    <strong>Q: </strong>{history.question}
                                </div>
                            </div>

                            {/* Answer Section (Left side) */}
                            <div className="flex justify-start mt-2">
                                <div className="bg-red-900/80 text-white p-3 rounded-3xl min-w-lg max-w-xl text-sm" ref={answerStartRef}>
                                    <strong>Ans: </strong>{history.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat and PDF Interaction Section */}
                <div className={`bg-white/30 backdrop-blur-2xl border-gray-700 border-4 p-6 rounded-3xl shadow-lg max-w-2xl w-full mx-auto ${firstQuestionAsked ? 'relative transform translate-y-1' : 'relative'}`}>
                    <h2 className="text-3xl font-semibold text-center mb-6">Chat using PDF</h2>

                    {/* Question Section */}
                    <div className="flex flex-row mx-auto justify-between items-center mt-6">
                        <input
                            type="text"
                            className="w-full p-2 border-2 border-yellow-800 rounded-3xl bg-gray-100"
                            placeholder="Ask a question"
                            value={question}
                            onChange={handleQuestionChange}
                            onKeyPress={handleKeyPress} // To trigger submit on Enter
                            disabled={loading}
                        />
                        <button
                            onClick={askQuestion}
                            disabled={loading}
                            className="mx-2 bg-yellow-600 text-white py-2 px-6 rounded-3xl hover:bg-yellow-700 disabled:bg-gray-300 transform hover:scale-110 transition duration-300 ease-in-out"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-t-4 border-yellow-600 border-solid rounded-full animate-spin"></div>
                            ) : (
                                "Ask"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfChat;
