"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import styles from "./Input.module.css";

export default function Input({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  }

  return (
    <div className={styles.wrapper}>
      <input
        placeholder="What's on your mind?..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && submit()
        }
      />
      <button onClick={submit}>
        <SendHorizontal size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
