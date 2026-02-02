"use client"

import { useState } from "react"
import { Message, Mode } from "@/types/chat"
import ChatHeader from "./ChatHeader"
import ModeToggle from "./ModeToggle"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"
import FileUpload from "./FileUpload"

export default function ChatLayout() {
  const [mode, setMode] = useState<Mode>("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setMessages([])
    setFile(null)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    if (mode === "rag" && !file) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Please upload a document first." },
      ])
      return
    }

    const userMessage = input
    setMessages((m) => [...m, { role: "user", text: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const endpoint = mode === "chat" ? "/api/chat" : "/api/rag"

      const request =
        mode === "chat"
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: userMessage }),
            }
          : (() => {
              const fd = new FormData()
              fd.append("message", userMessage)
              if (file) fd.append("file", file)
              return { method: "POST", body: fd }
            })()

      const res = await fetch(endpoint, request)
      if (!res.ok) throw new Error("API error")

      const data = await res.json()

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply ?? "No response",
          sources: data.sources,
        },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Something went wrong. Try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ChatHeader mode={mode} />
      <ModeToggle mode={mode} setMode={handleModeChange} />
      <MessageList messages={messages} />

      {mode === "rag" && <FileUpload onUpload={setFile} />}

      <ChatInput
        value={input}
        setValue={setInput}
        onSend={sendMessage}
        disabled={loading}
      />
    </>
  )
}
