from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
import google.generativeai as genai
from langchain.prompts import PromptTemplate
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set")

genai.configure(api_key=api_key)

# FastAPI app initialization
app = FastAPI()

# Allow CORS for frontend on localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create a Pydantic model for the input data
class QueryRequest(BaseModel):
    question: str


# Function to define the conversational chain
def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)

    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain


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


# Health check endpoint
@app.get("/")
async def root():
    return {"status": "Legal Mitra API is running"}


# Run the app
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
