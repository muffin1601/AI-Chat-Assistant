# 🧪 Velora AI: The Ultimate Testing & Technical Manual

This guide will walk you through every feature of your application, how to test it, and exactly what is happening "under the hood."

---

## 🏗️ The Universal Workflow
Before testing, understand the **Architecture**:
1. **The Brain**: Groq API (Llama 3.1) performs the reasoning.
2. **The Library**: Supabase (PostgreSQL) stores your chats, messages, and document chunks.
3. **The Search Engine**: [PersistentVectorStore](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/lib/vector-db.ts#12-76) (in [src/lib/vector-db.ts](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/lib/vector-db.ts)) handles looking up document facts.

---

## 📁 Scenario 1: The Knowledge Base (RAG)
**Testing Goal**: Verify the AI can "read" files and cite sources.

### **Steps to Test**:
1. **Upload**: Use the "Add Document" button to upload [test-data/nexus_logistics_2026.txt](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/test-data/nexus_logistics_2026.txt) (or a `.pdf`/`.docx` of your choice).
2. **Verify**: Wait for the green checkmark in the sidebar.
3. **Toggle**: Ensure the top-right toggle is set to **"Knowledge Base"**.
4. **Ask**: *"What is the revenue target for 2026?"*

### **Technical Workflow**:
* **Upload**: `DocumentUpload.tsx` converts the file to a Base64 string $\rightarrow$ `/api/upload` route.
* **Extraction**: [rag-utils.ts](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/lib/rag-utils.ts) uses `pdf-parse` or `mammoth` to turn the file into raw text.
* **Chunking**: `RecursiveCharacterTextSplitter` cuts the text into 1,000-character pieces.
* **Persistence**: `globalVectorStore.addDocuments` saves these pieces into your **Supabase `documents` table**.
* **Retrieval**: When you ask a question, the server searches the `documents` table for words matching your query and sends those specific paragraphs to the AI as "Context."

---

## 🌐 Scenario 2: General Intelligence (Normal API)
**Testing Goal**: Verify the AI can act like a standard assistant without documents.

### **Steps to Test**:
1. **Toggle**: Switch the top-right toggle to **"General"**.
2. **Ask**: *"Write a 10-line poem about the moon."*
3. **Observation**: The AI should answer instantly and **not** mention any documents or sources.

### **Technical Workflow**:
* **API Route**: In [/api/chat/route.ts](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/app/api/chat/route.ts), the `useRag` boolean is `false`.
* **Bypass**: The code skips the `globalVectorStore.similaritySearch` step entirely.
* **Prompt**: The AI is given a simple "You are a helpful assistant" prompt instead of the doc-heavy RAG prompt.

---

## 💾 Scenario 3: Session & Data Persistence
**Testing Goal**: Verify your database is saving everything.

### **Steps to Test**:
1. **History**: Send 2-3 messages in your current chat.
2. **Refresh**: Refresh your browser (F5).
3. **Switching**: Click **"+ New Chat"** in the sidebar. 
4. **Reloading**: Click back on your previous chat in the sidebar.

### **Technical Workflow**:
* **[initChat](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/components/chat/ChatArea.tsx#25-50)**: Every time [ChatArea](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/components/chat/ChatArea.tsx#16-156) loads, it checks if it has a `chatId`.
* **Fetch**: If you selected an old chat, it runs `supabase.from('messages').select(*)` to rebuild your chat history.
* **Incremental Saving**: Every user message and every *completed* AI message is sent to the **Supabase `messages` table** via `supabase.insert()`.

---

## 🗑️ Scenario 4: Housekeeping (Management)
**Testing Goal**: Verify deletion and UI cleanup.

### **Steps to Test**:
1. **Delete One**: Hover over a chat in the sidebar and click the **Trash Icon**. Confirm the popup.
2. **Delete All**: Click the **Trash Icon** at the top of the "Your Conversations" section. Confirm the popup.
3. **Effect**: The sidebar should instantly empty out.

### **Technical Workflow**:
* **Cascading Delete**: In Supabase, deleting a row in the `chats` table automatically deletes all related rows in the `messages` table (thanks to the `ON DELETE CASCADE` rule we set up).
* **Real-time Listener**: The [Sidebar.tsx](file:///c:/Users/Admin/Desktop/Sana/ai-chatbot/src/components/sidebar/Sidebar.tsx) has a `supabase.channel` open. As soon as the database changes, the UI updates automatically without a refresh.

---

## 💡 Pro-Tips for your Portfolio Demo:
* **Empty State**: Show how the sidebar says *"No conversations yet"* when it's empty.
* **Luxury Feel**: Point out how the **Citation Badges** (gold highlights in text) appear only when using documents.
* **Speed**: Show how fast **Groq** streams the response compared to standard ChatGPT!
