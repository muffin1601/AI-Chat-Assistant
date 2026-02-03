"use client"

import { useState } from "react"
import { Mode } from "@/types/chat"
import styles from "./ChatInput.module.css"

export default function ChatInput({
  mode,
  onSend,
}: {
  mode: Mode
  onSend: (msg: string) => void
}) {
  const [text, setText] = useState("")

  return (
    <div className={styles.inputWrap}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          mode === "chat"
            ? "Ask me anything…"
            : "Ask about your documents…"
        }
      />
      <button
        onClick={() => {
          onSend(text)
          setText("")
        }}
      >
        ↑
      </button>
    </div>
  )
}
