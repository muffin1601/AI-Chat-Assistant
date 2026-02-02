import { Message } from "@/types/chat"
import MessageBubble from "./MessageBubble"

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="chatBox">
      {messages.map((m, i) => (
        <MessageBubble key={i} msg={m} />
      ))}
    </div>
  )
}
