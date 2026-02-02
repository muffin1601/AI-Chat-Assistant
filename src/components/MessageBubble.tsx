import { Message } from "@/types/chat"

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user"

  return (
    <div className={`messageRow ${isUser ? "userRow" : "botRow"}`}>
      <div className={`bubble ${isUser ? "userBubble" : "botBubble"}`}>
        {msg.text.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {msg.sources && (
          <div className="sources">Sources: {msg.sources.join(", ")}</div>
        )}
      </div>
    </div>
  )
}
