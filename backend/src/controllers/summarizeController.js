// controllers/summarizeController.js

import axios from 'axios';

// Summarize Text
export const summarizeText = async (req, res) => {
  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: "Input text is required" });
  }

  try {
    // Make a request to Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: inputText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,  // Use API Key from .env
        },
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      res.json({ summary: response.data[0].summary_text });
    } else {
      res.status(500).json({ error: 'Failed to summarize the text' });
    }
  } catch (error) {
    res.status(500).json({ error: `Error summarizing text: ${error.message}` });
  }
};
