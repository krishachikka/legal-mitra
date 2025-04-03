import speech_recognition as sr
from deep_translator import GoogleTranslator
from gtts import gTTS
import pygame

# Step 1: Audio to text translation
r = sr.Recognizer()

# Available languages for speech input
available_languages = {
    "Hindi": "hi",
    "Bengali": "bn",
    "Telugu": "te",
    "Marathi": "mr",
    "Tamil": "ta",
    "Gujarati": "gu",
    "Malayalam": "ml",
    "Kannada": "kn",
    "Punjabi": "pa",
    "Urdu": "ur",
}


def choose_language():
    print("Choose an Indian language for input speech:")
    for idx, language in enumerate(available_languages, 1):
        print(f"{idx}. {language}")

    choice = int(input("Enter the number of your choice: ")) - 1
    if 0 <= choice < len(available_languages):
        return list(available_languages.values())[choice]
    else:
        print("Invalid choice. Defaulting to Hindi.")
        return "hi"  # Default language in case of invalid input


# Function for translating text
def translate_text(speech_text, target_language="en"):
    translated_text = GoogleTranslator(source="auto", target=target_language).translate(
        speech_text
    )
    print("Translated Text:", translated_text)
    return translated_text  # Return translated text for use in TTS


def main():
    # Choose input language
    input_language = choose_language()

    with sr.Microphone() as source:
        print(
            f"Speak now in {list(available_languages.keys())[list(available_languages.values()).index(input_language)]}..."
        )
        audio = r.listen(source)
        try:
            # Recognize speech using Google Speech Recognition
            speech_text = r.recognize_google(audio, language=input_language)
            print("Recognized Speech:", speech_text)

            # Translate text to English
            translated_text = translate_text(speech_text)

            # Convert translated text to speech
            tts = gTTS(translated_text, lang="en")
            tts.save("translated_voice.mp3")

            # Initialize pygame mixer and play the translated voice
            pygame.mixer.init()
            pygame.mixer.music.load("translated_voice.mp3")
            pygame.mixer.music.play()

            # Wait until the music finishes playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)

        except sr.UnknownValueError:
            print("Sorry, I couldn't understand the speech.")
        except sr.RequestError:
            print("Sorry, there was an issue with the Google API request.")


# Run the program
if __name__ == "__main__":
    main()
