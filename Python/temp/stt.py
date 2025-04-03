from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import speech_recognition as sr
from googletrans import Translator
from gtts import gTTS
import pygame
import os
import threading
import asyncio

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for specific origin (e.g., localhost for development)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Initialize recognizer and translator
r = sr.Recognizer()
translator = Translator()


# Function to translate text to English (asynchronous)
async def translate_text(speech_text, dest_lang="en"):
    translated_text = await translator.translate(speech_text, dest=dest_lang)
    return translated_text.text


# Function to handle audio recording and translation
def handle_audio_translation(input_language, callback):
    with sr.Microphone() as source:
        print(f"Listening for speech in {input_language}...")
        audio = r.listen(source)

        try:
            speech_text = r.recognize_google(audio, language=input_language)
            print("Recognized Speech:", speech_text)

            # Run the async translate function in a synchronous manner using asyncio.run
            translated_text = asyncio.run(translate_text(speech_text))

            # Convert the translated text to speech
            tts = gTTS(translated_text, lang="en")
            tts.save("response.mp3")

            # Play the generated speech using pygame
            pygame.mixer.init()
            pygame.mixer.music.load("response.mp3")
            pygame.mixer.music.play()

            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)

            callback(translated_text)

        except sr.UnknownValueError:
            callback({"error": "Could not understand the speech"})
        except sr.RequestError:
            callback({"error": "Could not request the result from Google API"})


# API endpoint to handle translation from audio
@app.route("/record_audio", methods=["POST"])
@cross_origin(origins="http://localhost:5173")  # Allow cross-origin requests here
def record_audio():
    input_language = request.json.get("input_language", "hi")

    # Use threading to handle the background task
    def callback(response):
        return jsonify({"translated_text": response})

    thread = threading.Thread(
        target=handle_audio_translation, args=(input_language, callback)
    )
    thread.start()

    return jsonify({"message": "Processing the audio..."}), 202


# API endpoint to handle text translation
@app.route("/translate", methods=["POST"])
@cross_origin(origins="http://localhost:5173")  # Allow cross-origin requests here
def handle_translation():
    data = request.json
    speech_text = data.get("speech_text", "")

    if not speech_text:
        return jsonify({"error": "No speech text provided"}), 400

    # Run the async translate function in a synchronous manner using asyncio.run
    translated_text = asyncio.run(translate_text(speech_text))
    return jsonify({"translated_text": translated_text})


if __name__ == "__main__":
    app.run(debug=True)
