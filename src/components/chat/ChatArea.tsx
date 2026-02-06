"use client";

import { useState } from "react";
import Message from "./Message";
import Input from "./Input";
import { readStream } from "@/lib/stream";
import styles from "./ChatArea.module.css";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatArea() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);

  async function sendMessage(text: string) {
    const updated: Msg[] = [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ];

    setMessages(updated);
    setStreaming(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updated.slice(0, -1),
      }),
    });

    if (!res.body) throw new Error("No stream body");

    await readStream(res.body, (token) => {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].content += token;
        return copy;
      });
    });

    setStreaming(false);
  }

  return (
    <main className={styles.chat}>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <Message
            key={i}
            role={m.role}
            content={m.content}
            streaming={streaming && i === messages.length - 1}
          />
        ))}
      </div>

      <Input onSend={sendMessage} />
    </main>
  );
}
