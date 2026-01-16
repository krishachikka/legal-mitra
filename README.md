
# ⚖️ Legal Mitra: Multilingual Legal Resources and Guidance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Framework: LangChain](https://img.shields.io/badge/Framework-LangChain-green.svg)](https://www.langchain.com/)
[![Vector DB: Pinecone](https://img.shields.io/badge/VectorDB-Pinecone-orange.svg)](https://www.pinecone.io/)

**Legal Mitra** is an enterprise-grade AI ecosystem designed to democratize legal access in India. By combining **Retrieval-Augmented Generation (RAG)** with domain-specific rule-aware reasoning, it provides citizens with grounded, citation-linked legal guidance in six regional languages.

## 🏆 Project Milestones & Recognition

| Achievement | Description | Record |
| :--- | :--- | :--- |
| **🥇 Hackathon Winner** | Awarded 1st place at **Code-o-Fiesta** for innovative legal-tech AI implementation. | [View Certificate](https://drive.google.com/file/d/1VA_JRFVYsFONZcoeW13FaTShAwGzXpsA/view?usp=sharing) |
| **📑 IEEE Publication** | Published research in IEEE Xplore. | [Read Paper](https://ieeexplore.ieee.org/document/11140002) |
| **📜 Registered Patent** | Novel architecture for multilingual legal retrieval & secure verification. | [Patent Copy](https://drive.google.com/file/d/1fqHANQBJlyw3oLeyUT6_RImjutMzntcy/view?usp=sharing) |

---


## Architecture:

### 1. Retrieval Augmented Generation (RAG):
<img width="1535" height="666" alt="image" src="https://github.com/user-attachments/assets/54c08406-9a8d-4917-9d01-8171dd7860b1" />

### 2. Legal Advice High Level Diagram:
<img width="1475" height="576" alt="image" src="https://github.com/user-attachments/assets/a935c60c-c92b-4649-b113-bff375a53a54" />


## Core Capabilities

1. **Multilingual Intelligence:**\
  Native support for 6 Indian languages via fine-tuned transformer models for high-precision legal translation.
2. **Grounded RAG Architecture:**\
  Vectorized knowledge base encompassing the **Constitution of India**, **IPC**, **CrPC**, and landmark case laws.
3. **Document-Chat Engine:**\
  Analyze complex legal artifacts including **FIRs**, **Notices**, and **Contracts** using contextual semantic search.
4. **Verification Suite:**\
  Secure lawyer onboarding utilizing **Computer Vision (OCR)** to validate Bar Council certificates against public records.
5. **Voice-to-Law:**\
  Seamless integration of ASR (Automatic Speech Recognition) for hands-free legal queries.

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| **LLM Orchestration** | LangChain |
| **Vector Store** | FAISS |
| **OCR/Vision** | Tesseract |
| **Backend** | FastAPI and Express |
| **Deployment** | Docker |

---

## Architecture Overview

The system utilizes a **bi-encoder/cross-encoder** pipeline for retrieval:
1.  **Query Expansion:** Re-writing user queries for better semantic matching.
2.  **Dense Retrieval:** Fetching top-k legal chunks from the vector database.
3.  **Reranking:** Re-ordering results based on jurisdiction relevance and case law priority.
4.  **Synthesis:** Generation of a response strictly grounded in the retrieved citations.

---

To market **Legal Mitra** with maximum impact, we will use a "Feature Spotlight" format. This focuses on the high-level value proposition while maintaining technical credibility.

---

## Platform Highlights

### 1. Multilingual Semantic Intelligence

* **Language-Agnostic Retrieval:** Leveraging multilingual transformers to bridge the gap between regional language queries and English-centric legal statutes.
* **Contextual Accuracy:** Goes beyond keyword matching to understand the *intent* of a legal grievance in Hindi, Marathi, Gujarati, and more.

### 2. Verified Citation Engine (RAG)

* **Zero-Hallucination Policy:** Every response is programmatically anchored to the **Constitution of India, IPC, and CrPC**.
* **Traceable Evidence:** Provides direct references to specific sections and landmark case laws, ensuring the guidance is legally defensible and trustworthy.

### 3. OCR-Powered Lawyer Verification

* **Computer Vision Validation:** Uses high-precision OCR and image processing to analyze Bar Council certificates for authenticity.
* **Secure Onboarding:** Cross-references extracted data with public records to ensure a high-trust environment for citizen-lawyer interactions.

### 4. Smart Document-Chat Engine

* **Automated Legal Analysis:** Instantly deconstructs complex documents like **FIRs, legal notices, and contracts**.
* **Actionable Summaries:** Translates dense "legalese" into simplified summaries, highlighting critical deadlines, obligations, and fundamental rights.

---

### The Vision

**Legal Mitra** is not just a tool; it is a scalable infrastructure for justice. By integrating this platform with public grievance systems, we aim to reduce the burden on local courts and empower every Indian citizen with a "Digital Legal Counsel" in their pocket.

---
