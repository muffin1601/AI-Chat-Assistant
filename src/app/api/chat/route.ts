import { NextResponse } from "next/server"
import { groqChat } from "@/lib/groq"

export async function POST(req: Request) {
  const { message } = await req.json()

  const reply = await groqChat([
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: message },
  ])

  return NextResponse.json({ reply })
}