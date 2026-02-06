export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function groqStream(messages: ChatMessage[]) {
  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        stream: true,
      }),
    }
  );

  if (!res.ok || !res.body) {
    throw new Error("Groq stream failed");
  }

  return res.body;
}
