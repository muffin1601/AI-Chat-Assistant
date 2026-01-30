import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: message },
          ],
        }),
      }
    )

    const data = await response.json()

    // 🔥 LOG EVERYTHING
    console.log("Groq status:", response.status)
    console.log("Groq response:", data)

    if (!response.ok) {
      return NextResponse.json(
        { reply: data.error?.message || "Groq API error" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json(
      { reply: "Server crashed" },
      { status: 500 }
    )
  }
}
