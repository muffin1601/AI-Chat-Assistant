import { Message } from "@/types/chat"
import styles from "./ChatMessages.module.css"

export default function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className={styles.messages}>
      {messages.map((m, i) => (
        <div
          key={i}
          className={m.role === "user" ? styles.user : styles.bot}
        >
          {m.text}
        </div>
      ))}
    </div>
  )
}
