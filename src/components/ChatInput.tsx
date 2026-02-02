"use client"

import { Send } from "lucide-react"
import styles from "@/app/page.module.css"

type Props = {
  value: string
  setValue: (v: string) => void
  onSend: () => void
  disabled: boolean
}

export default function ChatInput({
  value,
  setValue,
  onSend,
  disabled,
}: Props) {
  return (
    <div className={styles.inputRow}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask something…"
        disabled={disabled}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />

      <button
        type="button"
        onClick={onSend}
        disabled={disabled}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  )
}
