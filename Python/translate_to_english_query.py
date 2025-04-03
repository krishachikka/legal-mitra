from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all domains (you can specify domains if you want to restrict it)
CORS(app, origins=["http://localhost:5173"])  # Adjust this if needed for your frontend


@app.route("/translate", methods=["POST"])
def translate_text():
    # Get the input JSON data from the request
    data = request.get_json()

    # Extract parameters from the incoming request
    text = data.get("text")
    target_lang = data.get("target_lang", "en")  # Default target language is English
    source_lang = data.get("source_lang")

    # Ensure the "text" parameter is provided
    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        # Perform translation using deep_translator
        if source_lang:
            translated_text = GoogleTranslator(
                source=source_lang, target=target_lang
            ).translate(text)
        else:
            translated_text = GoogleTranslator(target=target_lang).translate(text)

        # Return the translated text as a JSON response
        return jsonify({"translated_text": translated_text})

    except Exception as e:
        # Return error message if something goes wrong
        return jsonify({"error": str(e)}), 500


# Start the Flask app
# Start the Flask app on port 5003
if __name__ == "__main__":
    app.run(debug=True, port=5003)
