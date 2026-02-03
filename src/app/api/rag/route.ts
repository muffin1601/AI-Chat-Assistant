import { NextResponse } from "next/server"
import { groqChat } from "@/lib/groq"

export async function POST(req: Request) {
  const { message, context } = await req.json()

  const reply = await groqChat([
    {
      role: "system",
      content:
        "Answer ONLY using the provided document context. If the answer is not in the context, say you don't know.",
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion:\n${message}`,
    },
  ])

  return NextResponse.json({
    reply,
    sources: ["Uploaded document"],
  })
}