"use client";

import styles from "./Sidebar.module.css";

const chats = [
  "Create Html Game Environment",
  "Apply To Leave For Emergency",
  "What is UI UX Design?",
  "Create POS System",
  "What is UX Audit?",
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>CHAT A.I+</div>

      <button className={styles.newChat}>＋ New chat</button>

      <div className={styles.section}>
        <span>Your conversations</span>
        <button className={styles.clear}>Clear All</button>
      </div>

      <div className={styles.list}>
        {chats.map((c, i) => (
          <div key={i} className={styles.chatItem}>
            {c}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.user}>Andrew Neilson</div>
      </div>
    </aside>
  );
}
