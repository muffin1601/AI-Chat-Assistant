"use client"

import { MessageCircle, FileText } from "lucide-react"
import styles from "@/app/page.module.css"
import { Mode } from "@/types/chat"

type Props = {
  mode: Mode
  setMode: (mode: Mode) => void
}

export default function ModeToggle({ mode, setMode }: Props) {
  return (
    <div className={styles.modeToggle}>
      <button
        type="button"
        className={mode === "chat" ? styles.active : ""}
        onClick={() => setMode("chat")}
      >
        <MessageCircle size={16} />
        Chat
      </button>

      <button
        type="button"
        className={mode === "rag" ? styles.active : ""}
        onClick={() => setMode("rag")}
      >
        <FileText size={16} />
        RAG
      </button>
    </div>
  )
}
