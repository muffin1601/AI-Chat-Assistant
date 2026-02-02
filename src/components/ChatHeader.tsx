"use client"

import { Sparkles } from "lucide-react"
import styles from "@/app/page.module.css"
import { Mode } from "@/types/chat"

type Props = {
  mode: Mode
}

export default function ChatHeader({ mode }: Props) {
  return (
    <div className={styles.chatHeader}>
      <Sparkles size={18} />
      AI Assistant
      <span className={styles.modeBadge}>
        {mode === "chat" ? "General Chat" : "Document Q&A"}
      </span>
    </div>
  )
}
