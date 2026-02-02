import { NextResponse } from "next/server"
import { groqChat } from "@/lib/groq"

export async function POST(req: Request) {
  const form = await req.formData()
  const question = form.get("message") as string

  const reply = await groqChat([
    {
      role: "system",
      content:
        "Answer ONLY using the provided document context. If not found, say you don't know.",
    },
    { role: "user", content: question },
  ])

  return NextResponse.json({
    reply,
    sources: ["Uploaded document"],
  })
}
