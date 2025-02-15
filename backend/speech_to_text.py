import speech_recognition as sr
from googletrans import Translator
import asyncio
from gtts import gTTS
import pygame  # Import pygame for sound playback

# Step 1: Audio to text translation
r = sr.Recognizer()

# Step 2: Text to text translation
translator = Translator()

# Indian language options for input speech
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


async def translate_text(speech_text):
    # Translate the text to English
    translated_text = await translator.translate(speech_text, dest="en")
    print("Translated Text:", translated_text.text)
    return translated_text.text  # Return translated text for use in TTS


async def main():
    # Choose language
    input_language = choose_language()

    with sr.Microphone() as source:
        # Step 1: Capture audio and recognize speech
        print(
            f"Speak Now in {list(available_languages.keys())[list(available_languages.values()).index(input_language)]}..."
        )
        audio = r.listen(source)
        try:
            speech_text = r.recognize_google(audio, language=input_language)
            print("Recognized Speech:", speech_text)

            # Step 2: Translate text to English
            translated_text = await translate_text(speech_text)

            # Step 3: Convert translated text to speech
            voice = gTTS(translated_text, lang="en")
            voice.save("voice.mp3")

            # Initialize pygame mixer and play the sound
            pygame.mixer.init()
            pygame.mixer.music.load("voice.mp3")
            pygame.mixer.music.play()

            # Wait until the music finishes playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)

        except sr.UnknownValueError:
            print("Could not understand the speech")
        except sr.RequestError:
            print("Could not request the result from Google API")


# Running the asynchronous main function
asyncio.run(main())
