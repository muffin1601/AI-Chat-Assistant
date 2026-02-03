
export type Mode = "chat" | "rag"

export type Message = {
  role: "user" | "bot"
  text: string
  sources?: string[]
}
