from flask import Flask, request, jsonify
from flask_cors import CORS
from keybert import KeyBERT

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

kw_model = KeyBERT()  # Load KeyBERT model


@app.route("/extract_keywords", methods=["POST"])
def extract_keywords():
    data = request.get_json()
    text = data.get("query", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Extract keywords using KeyBERT
    keywords = kw_model.extract_keywords(
        text, keyphrase_ngram_range=(1, 2), stop_words="english"
    )
    extracted_keywords = [kw[0] for kw in keywords]  # Extract only words

    # Print extracted keywords in console
    print("Extracted Keywords:", extracted_keywords)

    return jsonify({"keywords": extracted_keywords})


# Corrected the name check for the script execution
if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Run API on port 5001
