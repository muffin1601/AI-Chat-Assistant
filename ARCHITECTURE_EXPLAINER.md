# SANA A.I - Architecture & RAG Explainer Guide

This document is designed to help you understand exactly how the AI SaaS Document Chat project works. You can use this guide to explain the architecture, components, and data flow to colleagues or stakeholders.

---

## 🧠 1. Core Concept: What is RAG?

**RAG stands for Retrieval-Augmented Generation.** 
Standard Large Language Models (LLMs) like GPT or Llama only know what they were trained on. If you ask them about your private company document, they won't know the answer. 

RAG solves this by acting like an "open-book test." 
1. **Upload**: You upload a document.
2. **Search (Retrieval)**: When you ask a question, the system searches your document for paragraphs relevant to your question.
3. **Answer (Generation)**: The system gives the LLM both your question AND the matching paragraphs, saying: *"Use these paragraphs to answer the question."*

---

## 🏗️ 2. The Data Flow (Step-by-Step)

### A. Document Upload Process (`/api/upload`)
1. **User Action**: The user clicks "Add Document" and selects `nexus_logistics_2026.txt`.
2. **Frontend (`DocumentUpload.tsx`)**: Converts the file into a "Base64 string" (a text format suitable for sending over the internet) and sends it to our backend server.
3. **Backend Route (`/api/upload`)**: Receives the file.
4. **Text Extraction (`rag-utils.ts`)**: If it's a PDF, we use `pdf-parse` to read the text. If it's a text file, we just read it directly.
5. **Chunking (`rag-utils.ts`)**: We use LangChain's `RecursiveCharacterTextSplitter`. Instead of saving one massive wall of text, this tool chops the document into smaller "chunks" (e.g., 1000 characters each), with slight overlap so sentences aren't cut in half.
6. **Vector Storage (`vector-db.ts`)**: These chunks are saved in our `globalVectorStore`. In a production app, this would be a database like Supabase or Pinecone. For this demo, it's stored in the server's actively running memory.

### B. Asking a Question (`/api/chat`)
1. **User Action**: The user types *"What is the revenue target?"*
2. **Search Phase (`vector-db.ts`)**: Before talking to the AI, our backend performs a **Similarity Search**. It looks through all the saved document chunks to find paragraphs containing words related to "revenue" and "target".
3. **Prompt Construction**: The backend grabs the top 4 most relevant chunks. It writes a hidden "System Prompt" to the AI that looks like this:
   > *"You are an AI assistant. Use the following CONTEXT to answer the question. CONTEXT: [Source: nexus_logistics_2026.txt] The revenue target is $450 million..."*
4. **LLM Generation (`groq.ts`)**: We send this massive combined prompt to the Groq API (running the Llama 3 model).
5. **Response Streaming**: Groq streams the answer back to the frontend word-by-word so the user doesn't have to wait 5 seconds for a bulk response.

---

## 🧩 3. Component Breakdown

Here is a breakdown of every major file we modified or created, and its exact job.

### 🎨 Frontend Components (`src/components/`)
*   **`Sidebar.tsx`**: The main navigation menu on the left side. It holds the logo, the "New Chat" button, and houses our upload component.
*   **`DocumentUpload.tsx`** *(New)*: The specific UI for the "Knowledge base" section. It handles the invisible `<input type="file">`, shows the loading spinner during uploads, and lists the files you've successfully uploaded.
*   **`ChatArea.tsx`**: The central brain of the user interface. It holds the list of messages in a React `useState` array. When you type a message, it updates this list and talks to `/api/chat`.
*   **`Message.tsx`**: Renders a single chat bubble. **Crucial change:** We updated the `ReactMarkdown` renderer inside this component to look for words formatted like `[Source: filename.txt]` and style them as premium gold citation badges.

### ⚙️ Backend Routes (`src/app/api/`)
*   **`upload/route.ts`**: The API endpoint that receives the frontend file, chunks it, and saves it to the database.
*   **`chat/route.ts`**: The API endpoint that intercepts your chat message, searches the Vector DB for context, formats the LLM prompt, and streams the answer back.
*   **`upload/clear/route.ts`**: A tiny endpoint that wipes the in-memory database clean when the user clicks the "X" button on the sidebar.

### 🧰 Libraries & Utilities (`src/lib/`)
*   **`rag-utils.ts`**: Holds the logic for processing files. We use `@langchain/textsplitters` here because it's the industry standard for intelligently breaking documents into digestible chunks for AI.
*   **`vector-db.ts`**: A mock "Database" class. It holds an array of document chunks in RAM and contains the custom `similaritySearch` function to find relevant paragraphs using keyword matching.
*   **`groq.ts`**: Handles the direct HTTP connection to Groq's super-fast AI inference engine. It passes our messages to the `llama-3.1-8b-instant` model.

---

## 💄 4. The Design System (Globals & CSS)
To give the app a premium "SaaS" feel, we utilized:
*   **Glassmorphism**: Using `backdrop-filter: blur(20px)` combined with semi-transparent backgrounds (`rgba(20, 20, 20, 0.4)`) to make elements look like frosted glass.
*   **Color Palette**: A strict dark mode base (`#050505`) contrasted with a signature Luxury Gold (`#d4af37`), avoiding harsh primary colors like standard blue or bright red.
*   **Micro-animations**: Tiny scale and opacity transitions when hovering over files or the upload button to make the app feel alive and responsive.
