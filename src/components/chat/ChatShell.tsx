"use client"

import { useState } from "react"
import { Mode, Message } from "@/types/chat"
import Sidebar from "./Sidebar"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import ModeToggle from "./ModeToggle"
import styles from "./ChatShell.module.css"

export default function ChatShell() {
  const [mode, setMode] = useState<Mode>("chat")
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <div className={styles.app}>
      <Sidebar />

      <main className={styles.main}>
        {messages.length === 0 ? (
          <div className={styles.hero}>
            <h1>How can I help you today?</h1>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
        ) : (
          <ChatMessages messages={messages} />
        )}

        <ChatInput
          mode={mode}
          onSend={(msg) =>
            setMessages((m) => [...m, { role: "user", text: msg }])
          }
        />
      </main>
    </div>
  )
}
