"use client";

import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Plus, Trash2, UserCircle2, Sparkles } from "lucide-react";
import DocumentUpload from "./DocumentUpload";

export default function Sidebar({ 
  onNewChat, 
  onSelectChat,
  activeChatId 
}: { 
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
  activeChatId?: string | null;
}) {
  const [chatList, setChatList] = useState<any[]>([]);

  useEffect(() => {
    fetchChats();

    // Set up a listener to refresh the list when a chat is added or updated
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchChats() {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setChatList(data);
    if (error) console.error("Error fetching chats:", error);
  }

  async function clearAllChats() {
    if (!window.confirm("Are you sure you want to delete ALL conversations? This cannot be undone.")) return;

    const { error } = await supabase
      .from('chats')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

    if (error) {
      console.error("Error clearing chats:", error);
      alert("Failed to clear chats.");
    } else {
      onNewChat?.();
      fetchChats();
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Sparkles size={24} color="var(--accent)" />
        VELORA A.I
      </div>

      <button className={styles.newChat} onClick={onNewChat}>
        <Plus size={18} />
        New chat
      </button>

      <DocumentUpload />

      <div className={styles.section}>
        <span>Your conversations</span>
        <button className={styles.clear} onClick={clearAllChats} title="Clear all chats">
          <Trash2 size={14} />
        </button>
      </div>

      <div className={styles.list}>
        {chatList.map((chat) => (
          <div 
            key={chat.id} 
            className={`${styles.chatItem} ${activeChatId === chat.id ? styles.activeChat : ""}`}
            onClick={() => onSelectChat?.(chat.id)}
          >
            <MessageSquare size={16} />
            <span className={styles.chatTitle}>{chat.title}</span>
            <button 
              className={styles.deleteButton}
              onClick={async (e) => {
                e.stopPropagation();
                
                const confirmed = window.confirm("Are you sure you want to delete this conversation? This cannot be undone.");
                
                if (confirmed) {
                  const { error } = await supabase
                    .from('chats')
                    .delete()
                    .eq('id', chat.id);
                  
                  if (error) {
                    console.error("Error deleting chat from DB:", error);
                    alert("Failed to delete chat. Please try again.");
                  } else {
                    if (activeChatId === chat.id) onNewChat?.();
                    fetchChats(); 
                  }
                }
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {chatList.length === 0 && (
          <div className={styles.emptyList}>No conversations yet</div>
        )}
      </div>

      <div className={styles.footer}>
        <UserCircle2 size={28} />
        <div className={styles.user}>Sara Siddiqui</div>
      </div>
    </aside>
  );
}
