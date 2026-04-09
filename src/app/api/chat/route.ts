import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { globalVectorStore } from "@/lib/vector-db";

export async function POST(req: Request) {
  const { messages, useRag }: { messages: any[], useRag: boolean } = await req.json();
  const userMessage = messages[messages.length - 1].content;

  let contextString = "";
  if (useRag) {
    const contextDocs = await globalVectorStore.similaritySearch(userMessage, 4);
    contextString = contextDocs.length > 0
      ? contextDocs.map(d => `[Source: ${d.metadata.source}]\n${d.pageContent}`).join("\n\n---\n\n")
      : "No relevant documents found.";
  }

  const systemPrompt = useRag 
    ? `You are a helpful AI assistant with access to uploaded documents. 
       Always answer based STRICTLY on the provided context if possible.

       CONTEXT:
       ${contextString}`
    : "You are a helpful AI assistant.";

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    messages: messages,
  });

  return result.toTextStreamResponse();
}
