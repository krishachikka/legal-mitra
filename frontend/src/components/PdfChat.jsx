import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PdfChat = () => {
    const [pdfFiles, setPdfFiles] = useState(null);
    const [uploadedPdfs, setUploadedPdfs] = useState([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [questionHistory, setQuestionHistory] = useState([]);
    const [firstQuestionAsked, setFirstQuestionAsked] = useState(false);

    // useEffect(() => {
    //     // Disable scrolling when the component is mounted
    //     document.body.style.overflow = 'hidden';

    //     // Cleanup: re-enable scrolling when the component is unmounted
    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, []);

    const chatEndRef = useRef(null); // Reference for auto-scrolling
    const answerStartRef = useRef(null); // Reference for showing the start of the answer

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("questionHistory")) || [];
        setQuestionHistory(savedHistory);
    }, []);

    useEffect(() => {
        // Scroll to the most recent message whenever the history changes
        if (questionHistory.length > 0) {
            if (answer && answer.length > 200) { // Check if the answer is long
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
            setUploadedPdfs(prevState => [...prevState, ...pdfFileNames]);
            alert("PDFs processed successfully!");
        } catch (error) {
            console.error("Error uploading PDF:", error);
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
            setAnswer(response.data.response);
            const updatedHistory = [...questionHistory, { question, answer: response.data.response }];
            setQuestionHistory(updatedHistory);
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
                            <li key={index} className="p-2 bg-white rounded-md">
                                {pdfName}
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
                                <strong>Q: </strong>{history.question}
                            </li>
                        ))
                    )}
                </ul>
                </section>
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
                                <div
                                    className="bg-red-900/80 text-white p-3 rounded-3xl min-w-lg max-w-xl text-sm"
                                    ref={answerStartRef} // Scroll to the start of the answer
                                >
                                    <strong>A: </strong>{history.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Reference to auto-scroll to the most recent chat */}
                    <div ref={chatEndRef} />
                </div>

                {/* PDF Upload Section */}
                <div className={`bg-white/30 backdrop-blur-2xl border-gray-700 border-4 p-6 rounded-3xl shadow-lg max-w-2xl w-full mx-auto ${firstQuestionAsked ? 'relative transform translate-y-1' : 'relative'}`}>
                    <h2 className="text-3xl font-semibold text-center mb-6">Chat using PDF</h2>

                    {/* PDF Upload Section */}
                    <div className="flex flex-row items-center mx-auto justify-around mb-6">
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
                        <button
                            onClick={uploadPdfFiles}
                            disabled={!pdfFiles}
                            className=" bg-gray-800 text-white py-2 px-6 rounded-3xl hover:bg-gray-700 transform hover:scale-110 disabled:bg-gray-300 transition duration-300 ease-in-out"
                        >
                            Upload and Process PDFs
                        </button>
                    </div>

                    {/* Question Section */}
                    <div className="flex flex-row mx-auto justify-between items-center">
                        <input
                            type="text"
                            className="w-full p-2 border-2 border-yellow-800 rounded-3xl bg-gray-100"
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
