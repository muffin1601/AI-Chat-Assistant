import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { globalVectorStore } from "@/lib/vector-db";

export async function POST(req: Request) {
  const { messages, useRag }: { messages: any[], useRag: boolean } = await req.json();

  // 1. Get the latest user message
  const userMessage = messages[messages.length - 1].content;

  let contextString = "";
  
  if (useRag) {
    // 2. Search for relevant context using your simplified search utility
    const contextDocs = await globalVectorStore.similaritySearch(userMessage, 4);
    contextString = contextDocs.length > 0
      ? contextDocs.map(d => `[Source: ${d.metadata.source}]\n${d.pageContent}`).join("\n\n---\n\n")
      : "No relevant documents found.";
  }

  // 3. Construct a context-aware system message
  const systemPrompt = useRag 
    ? `You are a helpful AI assistant with access to uploaded documents. 
       Always answer based STRICTLY on the provided context if possible.
       If the context doesn't contain the answer, tell the user you don't have that information in your knowledge base but will try to help with general knowledge.
       Always cite your sources if you use them.

       CONTEXT:
       ${contextString}`
    : "You are a helpful AI assistant. Provide helpful, accurate, and concise responses based on your general knowledge.";

  // 4. Use Vercel AI SDK streamText for Gemini
  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: systemPrompt,
    messages: messages,
  });

  return result.toTextStreamResponse();
}
