from flask import Flask, request, jsonify
from transformers import MarianMTModel, MarianTokenizer
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
from flask_cors import CORS  

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Load the translation model (Hindi to English)
model_name = "Helsinki-NLP/opus-mt-hi-en"
model = MarianMTModel.from_pretrained(model_name)
tokenizer = MarianTokenizer.from_pretrained(model_name)

# Function to translate text using MarianMTModel
def translate_text(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    return tokenizer.decode(translated[0], skip_special_tokens=True)

# Function to convert Romanized Hindi to Devanagari
def roman_to_hindi(text):
    return transliterate(text, sanscript.ITRANS, sanscript.DEVANAGARI)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400  

    roman_text = data.get('text', '').strip()
    if not roman_text:
        return jsonify({"error": "Empty text"}), 400 

    try:
        # Convert Romanized Hindi to Devanagari
        hindi_text = roman_to_hindi(roman_text)

        # Translate the text into English
        translated_text = translate_text(hindi_text)

        return jsonify({'translation': translated_text})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
