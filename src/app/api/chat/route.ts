import { NextResponse } from "next/server";
import { groqStream, ChatMessage } from "@/lib/groq";
import { globalVectorStore } from "@/lib/vector-db";

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  // 1. Get the latest user message
  const userMessage = messages[messages.length - 1].content;

  // 2. Search for relevant context
  const contextDocs = await globalVectorStore.similaritySearch(userMessage, 4);

  const contextString = contextDocs.length > 0
    ? contextDocs.map(d => `[Source: ${d.metadata.source}]\n${d.pageContent}`).join("\n\n---\n\n")
    : "No relevant documents found.";

  // 3. Construct a RAG-enhanced system message
  const systemPrompt: ChatMessage = {
    role: "system",
    content: `You are a helpful AI assistant with access to uploaded documents. 
      Use the following context to answer the user's question. 
      If the context doesn't contain the answer, tell the user you don't have that information in your knowledge base but will try to help with general knowledge.
      Always cite your sources if you use them.

      CONTEXT:
      ${contextString}`
  };

  // 4. Prepend system prompt (or replace existing one)
  const augmentedMessages = [systemPrompt, ...messages.filter(m => m.role !== 'system')];

  const stream = await groqStream(augmentedMessages);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
