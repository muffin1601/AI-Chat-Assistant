"use client"

import { useState } from "react"
import styles from "./page.module.css"

type Message = {
  role: "user" | "bot"
  text: string
}

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input
    setMessages(prev => [...prev, { role: "user", text: userMessage }])
    setInput("")
    setLoading(true)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await res.json()
    setMessages(prev => [...prev, { role: "bot", text: data.reply }])
    setLoading(false)
  }

  return (
    <main className={styles.app}>
      {/* LEFT SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Chats</div>

        <div className={styles.chatList}>
          <div className={styles.chatItemActive}>
            <div className={styles.avatar}>🤖</div>
            <div>
              <p className={styles.chatTitle}>AI Assistant</p>
              <span className={styles.chatPreview}>Last message…</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT CHAT */}
      <section className={styles.chatArea}>
        <div className={styles.chatHeader}>AI Assistant</div>

        <div className={styles.chatBox}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.messageRow} ${
                msg.role === "user" ? styles.userRow : styles.botRow
              }`}
            >
              <div
                className={`${styles.bubble} ${
                  msg.role === "user" ? styles.userBubble : styles.botBubble
                }`}
              >
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className={styles.botRow}>
              <div className={`${styles.bubble} ${styles.botBubble}`}>
                <span className={styles.typing}>Typing…</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message"
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            className={styles.button}
            onClick={sendMessage}
            disabled={loading}
          >
            ➤
          </button>
        </div>
      </section>
    </main>
  )
}
