"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import styles from "./page.module.css";

export default function Page() {
  const [sessionKey, setSessionKey] = useState(0);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    setActiveChatId(null);
    setSessionKey(prev => prev + 1);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setSessionKey(prev => prev + 1);
  };

  return (
    <div className={styles.app}>
      <Sidebar 
        onNewChat={handleNewChat} 
        onSelectChat={handleSelectChat}
        activeChatId={activeChatId}
      />
      <ChatArea key={sessionKey} loadedChatId={activeChatId} />
    </div>
  );
}
