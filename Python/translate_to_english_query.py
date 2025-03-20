from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    target_lang = data.get("target_lang", "en")
    source_lang = data.get("source_lang")

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

        return jsonify({"translated_text": translated_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
