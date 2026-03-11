"use client";

import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import Input from "./Input";
import { readStream } from "@/lib/stream";
import styles from "./ChatArea.module.css";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

import { supabase } from "@/lib/supabase";

export default function ChatArea({ loadedChatId }: { loadedChatId?: string | null }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [useRag, setUseRag] = useState(true);
  const [chatId, setChatId] = useState<string | null>(loadedChatId || null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize or Load Chat Session
  useEffect(() => {
    async function initChat() {
      if (loadedChatId) {
        // Load existing messages
        const { data, error } = await supabase
          .from('messages')
          .select('role, content')
          .eq('chat_id', loadedChatId)
          .order('created_at', { ascending: true });
        
        if (data) setMessages(data as Msg[]);
        if (error) console.error("Error loading messages:", error);
      } else {
        // Create new chat session
        const { data, error } = await supabase
          .from('chats')
          .insert([{ title: 'New Conversation' }])
          .select()
          .single();
        
        if (data) setChatId(data.id);
        if (error) {
          console.error("Supabase Error:", error.message);
        }
      }
    }
    initChat();
  }, [loadedChatId]);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text: string) {
    if (!chatId) return;

    // 1. Save User Message to Supabase
    await supabase.from('messages').insert([
      { chat_id: chatId, role: 'user', content: text }
    ]);

    // 2. Automagically update chat title if it's the first message
    if (messages.length === 0) {
      const title = text.length > 30 ? text.substring(0, 30) + "..." : text;
      await supabase
        .from('chats')
        .update({ title })
        .eq('id', chatId);
    }

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
        useRag,
      }),
    });

    if (!res.body) throw new Error("No stream body");

    let fullAIResponse = "";

    await readStream(res.body, (token) => {
      fullAIResponse += token;
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const lastMsg = prev[prev.length - 1];
        const updatedLastMsg = {
          ...lastMsg,
          content: lastMsg.content + token,
        };
        return [...prev.slice(0, -1), updatedLastMsg];
      });
    });

    // 2. Save Complete Assistant Message to Supabase
    await supabase.from('messages').insert([
      { chat_id: chatId, role: 'assistant', content: fullAIResponse }
    ]);

    setStreaming(false);
  }

  return (
    <main className={styles.chat}>
      <header className={styles.header}>
        <div className={styles.chatInfo}>
          <span className={styles.activeChat}>Current Session</span>
        </div>
        
        <div className={styles.modeToggle}>
          <span className={!useRag ? styles.activeMode : ""}>General</span>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={useRag} 
              onChange={(e) => setUseRag(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
          <span className={useRag ? styles.activeMode : ""}>Knowledge Base</span>
        </div>
      </header>

      <div className={styles.messages} ref={scrollRef}>
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
