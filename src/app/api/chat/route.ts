import { NextResponse } from "next/server";
import { groqStream, ChatMessage } from "@/lib/groq";

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  const stream = await groqStream(messages);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
