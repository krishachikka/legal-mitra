import speech_recognition as sr
from googletrans import Translator
import asyncio
from gtts import gTTS
import pygame  # Import pygame for sound playback

# Step 1: Audio to text translation
r = sr.Recognizer()

# Step 2: Text to text translation
translator = Translator()


async def translate_text(speech_text):
    # Translate the text to Hindi
    translated_text = await translator.translate(speech_text, dest="en")
    print("Translated Text:", translated_text.text)
    return translated_text.text  # Return translated text for use in TTS


async def main():
    with sr.Microphone() as source:
        # Step 1: Capture audio and recognize speech
        print("Speak Now")
        audio = r.listen(source)
        try:
            speech_text = r.recognize_google(audio)
            print("Recognized Speech:", speech_text)

            # Step 2: Translate text to Hindi
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
            print("Could not understand")
        except sr.RequestError:
            print("Could not request the result")


# Running the asynchronous main function
asyncio.run(main())
