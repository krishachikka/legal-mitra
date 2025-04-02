import streamlit as st
import pdfplumber
import pytesseract
from PIL import Image
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import io
import re
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Set the path for Tesseract (if it's not in your PATH already)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# Function to extract text from a PDF using pdfplumber and OCR
def extract_text_from_pdf(pdf_file):
    text = ""
    images = []

    # Load the PDF from the uploaded file
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            # Extract text from text-based pages
            text += page.extract_text()

            # If no text is found, try extracting from images using OCR
            if not text.strip():  # If page text extraction failed, use OCR
                im = page.to_image()
                pil_image = im.original
                images.append(pil_image)
                text += pytesseract.image_to_string(pil_image)

    return text, images


# Function to extract text from an image using OCR
def extract_text_from_image(image_file):
    pil_image = Image.open(image_file)
    text = pytesseract.image_to_string(pil_image)
    return text, [pil_image]


# Function to extract keywords from text (using TF-IDF)
def extract_keywords(text):
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()

    # Get the top 10 keywords based on TF-IDF score
    top_keywords = sorted(
        zip(tfidf_matrix.sum(axis=0).A1, feature_names), reverse=True
    )[:10]
    return [keyword for score, keyword in top_keywords]


# Function to compare the structure of two documents
def compare_structure(text1, text2):
    # Define simple structure elements like "Name", "Date", etc.
    structure_keywords = [
        "name",
        "date",
        "certificate",
        "number",
        "valid",
        "issue",
        "authority",
    ]

    structure1 = [
        word.lower() for word in text1.split() if word.lower() in structure_keywords
    ]
    structure2 = [
        word.lower() for word in text2.split() if word.lower() in structure_keywords
    ]

    # Compare the number of structure elements found in both
    common_structure_elements = len(set(structure1).intersection(structure2))
    total_structure_elements = max(len(set(structure1)), len(set(structure2)))

    # Calculate structure similarity as the percentage of common elements
    if total_structure_elements > 0:
        return (common_structure_elements / total_structure_elements) * 100
    return 0


# Function to compute the similarity between two texts based on keywords
def calculate_keyword_similarity(text1, text2):
    # Extract keywords from both documents
    keywords1 = extract_keywords(text1)
    keywords2 = extract_keywords(text2)

    # Count how many keywords are common between both documents
    common_keywords = set(keywords1).intersection(set(keywords2))

    # Calculate the percentage of common keywords
    similarity_percentage = (
        (len(common_keywords) / len(keywords1)) * 100 if keywords1 else 0
    )
    return similarity_percentage


# Function to highlight similarities in PDFs using matplotlib
def highlight_similarities_on_pdf(image1, image2):
    # Convert PIL images to numpy arrays for compatibility with matplotlib
    image1_np = np.array(image1)
    image2_np = np.array(image2)

    # Create a new figure to overlay images
    fig, ax = plt.subplots(1, 2, figsize=(10, 5))

    ax[0].imshow(image1_np)
    ax[0].set_title("Template Certificate")

    ax[1].imshow(image2_np)
    ax[1].set_title("Certificate to Verify")

    # Highlight similar text in both images (for simplicity, we'll just highlight a sample area)
    # In a real-world scenario, you can use OCR bounding box positions and align similar words
    # Increase the size of the rectangle to make it more visible
    similar_area = patches.Rectangle(
        (50, 50), 150, 60, linewidth=3, edgecolor="red", facecolor="red", alpha=0.5
    )
    ax[0].add_patch(similar_area)
    ax[1].add_patch(similar_area)

    # Hide axes
    ax[0].axis("off")
    ax[1].axis("off")

    # Display the annotations
    st.pyplot(fig)


# Streamlit UI
st.title("Certificate Verification System")
st.markdown(
    """
    Upload a template certificate (Type) and a certificate to verify. The system will:
    - Check if keywords in the template appear in the certificate.
    - Compare the structure (like sections and headings) of both documents.
    - Highlight the areas with matching content.
"""
)

# File uploaders for the two files (PDFs or images)
file1 = st.file_uploader(
    "Upload the template certificate (Type) file (PDF or Image)",
    type=["pdf", "png", "jpg", "jpeg"],
)
file2 = st.file_uploader(
    "Upload the certificate to verify (PDF or Image)",
    type=["pdf", "png", "jpg", "jpeg"],
)


# Function to determine similarity color
def similarity_color(percentage, threshold):
    if percentage >= threshold[0]:
        return "green"
    elif percentage < threshold[1]:
        return "red"
    else:
        return "yellow"


# Button to trigger similarity check
if file1 and file2:
    # Extract text and images based on file type
    if file1.type == "application/pdf":
        text1, images1 = extract_text_from_pdf(file1)
    else:
        text1, images1 = extract_text_from_image(file1)

    if file2.type == "application/pdf":
        text2, images2 = extract_text_from_pdf(file2)
    else:
        text2, images2 = extract_text_from_image(file2)

    # Step 1: Check keyword similarity
    keyword_similarity = calculate_keyword_similarity(text1, text2)

    # Step 2: Check structural similarity (i.e., headings, sections, etc.)
    structure_similarity = compare_structure(text1, text2)

    # Display similarity results with color-coded percentages
    keyword_color = similarity_color(keyword_similarity, (30, 5))
    structure_color = similarity_color(structure_similarity, (70, 20))

    st.markdown(f"### Keyword Similarity: {keyword_similarity:.2f}%")
    st.markdown(
        f"<p style='color:{keyword_color}; font-size:20px;'>{keyword_similarity:.2f}%</p>",
        unsafe_allow_html=True,
    )

    st.markdown(f"### Structural Similarity: {structure_similarity:.2f}%")
    st.markdown(
        f"<p style='color:{structure_color}; font-size:20px;'>{structure_similarity:.2f}%</p>",
        unsafe_allow_html=True,
    )

    # Highlight matching areas if the similarity is high enough
    if keyword_similarity >= 30 and structure_similarity >= 70:
        st.success(f"The certificate is likely to be valid based on template matching!")
        if images1 and images2:
            st.write("Highlighting the matching areas...")
            col1, col2 = st.columns(2)
            with col1:
                st.image(images1[0], caption="Template Certificate")
            with col2:
                st.image(images2[0], caption="Certificate to Verify")
    else:
        st.warning("The certificate does not match the template sufficiently.")
