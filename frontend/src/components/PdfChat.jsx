import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    styled
} from "@mui/material";

// Custom styled components using Material UI styled API
const ContainerStyled = styled(Container)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: theme.spacing(3),
}));

const CardStyled = styled(Card)(({ theme }) => ({
    width: "100%",
    maxWidth: 600,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    textAlign: "center",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 3),
    backgroundColor: "#3f51b5",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#303f9f",
    },
}));

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
        <ContainerStyled>
            <CardStyled>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Chat with PDF
                    </Typography>

                    {/* PDF Upload Section */}
                    <Box>
                        <ButtonStyled
                            variant="contained"
                            component="label"
                        >
                            Select PDF Files
                            <input
                                type="file"
                                multiple
                                hidden
                                onChange={handleFileChange}
                            />
                        </ButtonStyled>
                        {pdfFiles && pdfFiles.length > 0 && (
                            <Typography variant="body2" color="textSecondary">
                                {pdfFiles.length} file(s) selected
                            </Typography>
                        )}
                        <ButtonStyled
                            variant="outlined"
                            onClick={uploadPdfFiles}
                            disabled={!pdfFiles}
                        >
                            Upload and Process PDFs
                        </ButtonStyled>
                    </Box>

                    {/* Question Section */}
                    <Box>
                        <TextField
                            variant="outlined"
                            label="Ask a question"
                            fullWidth
                            value={question}
                            onChange={handleQuestionChange}
                            disabled={loading}
                        />
                        <ButtonStyled
                            variant="contained"
                            onClick={askQuestion}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Ask"}
                        </ButtonStyled>
                    </Box>

                    {/* Answer Display */}
                    {loading && (
                        <CircularProgress />
                    )}
                    {!loading && answer && (
                        <Box sx={{ marginTop: 3, padding: 2, border: "1px solid #ddd", borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                            <Typography variant="h6">Answer:</Typography>
                            <Typography>{answer}</Typography>
                        </Box>
                    )}
                </CardContent>
            </CardStyled>
        </ContainerStyled>
    );
};

export default PdfChat;
