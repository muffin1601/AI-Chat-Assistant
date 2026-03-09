"use client";

import styles from "./Sidebar.module.css";
import { MessageSquare, Plus, Trash2, UserCircle2, Sparkles } from "lucide-react";

const chats = [
  "Create Html Game Environment",
  "Apply To Leave For Emergency",
  "What is UI UX Design?",
  "Create POS System",
  "What is UX Audit?",
];

import DocumentUpload from "./DocumentUpload";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Sparkles size={24} color="var(--accent)" />
        SANA A.I
      </div>

      <button className={styles.newChat}>
        <Plus size={18} />
        New chat
      </button>

      <DocumentUpload />

      <div className={styles.section}>
        <span>Your conversations</span>
        <button className={styles.clear}>
          <Trash2 size={14} />
        </button>
      </div>

      <div className={styles.list}>
        {chats.map((c, i) => (
          <div key={i} className={styles.chatItem}>
            <MessageSquare size={16} />
            {c}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <UserCircle2 size={28} />
        <div className={styles.user}>Andrew Neilson</div>
      </div>
    </aside>
  );
}
