from googletrans import Translator
import asyncio

# Initialize the translator
translator = Translator()


# Define an async function to handle the translation
async def translate_text():
    # Take English input from the user
    text = input("Enter text in English: ")

    # List of popular languages in India
    languages = ["hi", "mr", "bn", "te", "ta", "gu", "kn", "ml", "pa", "or"]

    # Translate the text into each language
    for lang in languages:
        translation = await translator.translate(text, src="en", dest=lang)
        print(f"Translation in {lang}: {translation.text}")


# Run the async function
asyncio.run(translate_text())


# कृष्ण कृपया यार को बंद करें