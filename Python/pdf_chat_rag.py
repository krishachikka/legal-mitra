import warnings
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import feedparser
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from deep_translator import GoogleTranslator
import logging
from keybert import KeyBERT

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set")

genai.configure(api_key=api_key)

# Fetch VITE_FRONTEND_URL from environment variables
frontend_url = os.getenv(
    "VITE_FRONTEND_URL", "http://localhost:5173"
)  # Default to localhost if not set

# FastAPI app initialization
app = FastAPI()

# Allow CORS for frontend on the URL from VITE_FRONTEND_URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],  # Use the dynamic URL from environment variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RSS feed URL
rss_url = (
    "https://www.barandbench.com/feed"  # Change this to any RSS feed URL you prefer
)

# Suppress FutureWarning from transformers
warnings.filterwarnings("ignore", category=FutureWarning)

# KeyBERT model initialization
kw_model = KeyBERT()


# Function to fetch RSS feed
def fetch_rss_feed():
    feed = feedparser.parse(rss_url)
    news_items = []

    if len(feed.entries) > 0:
        for entry in feed.entries[:10]:  # Fetch 10 entries
            news_item = {
                "title": entry.title,
                "link": entry.link,
                "summary": entry.summary,
                "published": entry.published,
                "image": None,
                "content": None,  # Adding content field for detailed article content
            }

            # Try to get the image from 'media_content' (common for RSS feeds with media)
            if "media_content" in entry:
                media = entry.media_content[0]
                if "url" in media:
                    news_item["image"] = media["url"]

            if not news_item["image"] and "enclosures" in entry:
                for enclosure in entry.enclosures:
                    if enclosure.get("type", "").startswith("image/"):
                        news_item["image"] = enclosure["url"]
                        break

            if not news_item["image"]:
                try:
                    response = requests.get(entry.link)
                    soup = BeautifulSoup(response.content, "html.parser")
                    og_image_tag = soup.find("meta", property="og:image")
                    if og_image_tag:
                        news_item["image"] = og_image_tag["content"]
                except Exception as e:
                    print(f"Error while scraping the article for image: {e}")

            if not news_item["image"]:
                news_item["image"] = (
                    "https://via.placeholder.com/600x200?text=Legal+News"
                )

            # Fetching detailed content from the article
            if not news_item["content"]:
                try:
                    response = requests.get(entry.link)
                    soup = BeautifulSoup(response.content, "html.parser")

                    # Example: Try to extract main content, based on the website's structure
                    content_tag = soup.find(
                        "div", class_="article-body"
                    )  # Adjust for the website structure
                    if content_tag:
                        # Extract and clean text
                        news_item["content"] = content_tag.get_text().strip()

                    # If no specific article body found, try scraping other parts
                    if not news_item["content"]:
                        content_tag = soup.find(
                            "div", class_="content"
                        )  # Example alternative structure
                        if content_tag:
                            news_item["content"] = content_tag.get_text().strip()

                except Exception as e:
                    print(f"Error while scraping detailed content: {e}")

            # If no image found, you can leave it as None or use a default image
            if not news_item["image"]:
                news_item["image"] = (
                    "https://via.placeholder.com/600x200?text=Legal+News"
                )

            news_items.append(news_item)

    return news_items


# Endpoint to fetch RSS news
@app.get("/api/news")
async def news():
    try:
        # Fetch and return the RSS feed data
        news_data = fetch_rss_feed()
        return news_data  # Return news as JSON
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error: {e}")
        return {"error": "Failed to fetch news"}, 500


# Function to extract text from PDFs
def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


# Function to split text into chunks
def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks


# Function to generate vector store using embeddings
def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")


# Function to create the conversational chain for Q&A
def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain


# Endpoint to upload PDF and process them
@app.post("/upload_pdf/")
async def upload_pdf(pdf_files: list[UploadFile]):
    pdf_docs = []
    for pdf_file in pdf_files:
        pdf_docs.append(pdf_file.file)

    # Extract text, split into chunks, and save vector store
    raw_text = get_pdf_text(pdf_docs)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)
    return {"message": "PDFs processed successfully!"}


# Endpoint to ask questions based on processed PDFs
class QuestionRequest(BaseModel):
    question: str  # Define expected request body structure


@app.post("/ask_question/")
async def ask_question(request: QuestionRequest):
    question = request.question  # Access question from request
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    # Load the vector store
    new_db = FAISS.load_local(
        "faiss_index", embeddings, allow_dangerous_deserialization=True
    )

    docs = new_db.similarity_search(question)

    # Get the response using the conversational chain
    chain = get_conversational_chain()
    response = chain(
        {"input_documents": docs, "question": question}, return_only_outputs=True
    )
    return {"response": response["output_text"]}


# Create a Pydantic model for the input data
class QueryRequest(BaseModel):
    question: str


# Function to handle user input and return the response
def user_input(user_question):
    try:
        logger.info(f"Processing question: {user_question}")

        # Make sure the vector_embeddings directory exists
        if not os.path.exists("vector_embeddings"):
            error_msg = "vector_embeddings directory not found"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        # Load the vector store
        logger.info("Loading FAISS index from vector_embeddings directory")
        new_db = FAISS.load_local(
            "vector_embeddings", embeddings, allow_dangerous_deserialization=True
        )

        # Search for similar documents
        logger.info("Performing similarity search")
        docs = new_db.similarity_search(user_question)
        logger.info(f"Found {len(docs)} similar documents")

        # Log first few chars of each document for debugging
        for i, doc in enumerate(docs):
            doc_preview = (
                doc.page_content[:100] + "..."
                if len(doc.page_content) > 100
                else doc.page_content
            )
            logger.info(f"Document {i+1} preview: {doc_preview}")

        # Get the conversational chain
        logger.info("Creating conversational chain")
        chain = get_conversational_chain()

        # Generate a response
        logger.info("Generating response")
        response = chain(
            {"input_documents": docs, "question": user_question},
            return_only_outputs=True,
        )

        logger.info("Response generated successfully")
        return response["output_text"]

    except Exception as e:
        logger.error(f"Error in user_input: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


# FastAPI endpoint to handle the query
@app.post("/ask-question/")
async def ask_question(query: QueryRequest):
    try:
        user_question = query.question
        logger.info(f"Received question: {user_question}")

        response_text = user_input(user_question)
        logger.info("Returning response to client")

        return {"response": response_text}

    except Exception as e:
        logger.error(f"Error in ask_question endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate/")
async def translate_text(
    text: str = Body(..., embed=True),
    target_lang: str = Body("en", embed=True),  # Default to English
    source_lang: str = Body(None, embed=True),
):
    # Ensure the "text" parameter is provided
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    try:
        # Perform translation using deep_translator
        if source_lang:
            translated_text = GoogleTranslator(
                source=source_lang, target=target_lang
            ).translate(text)
        else:
            translated_text = GoogleTranslator(target=target_lang).translate(text)

        # Return the translated text as a JSON response
        return {"translated_text": translated_text}

    except Exception as e:
        # Return error message if something goes wrong
        raise HTTPException(status_code=500, detail=str(e))


# Pydantic model to handle the request body
class QueryRequest(BaseModel):
    query: str


@app.post("/extract_keywords")
async def extract_keywords(query: QueryRequest):
    text = query.query

    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    # Extract keywords using KeyBERT
    keywords = kw_model.extract_keywords(
        text, keyphrase_ngram_range=(1, 2), stop_words="english"
    )
    extracted_keywords = [kw[0] for kw in keywords]  # Extract only words

    # Log the extracted keywords
    logger.info(f"Extracted Keywords: {extracted_keywords}")

    return {"keywords": extracted_keywords}


# Health check endpoint
@app.get("/")
async def root():
    return {"status": "Legal Mitra API is running"}
