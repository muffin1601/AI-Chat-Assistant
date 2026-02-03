import { Mode } from "@/types/chat"
import styles from "./ModeToggle.module.css"

export default function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode
  onChange: (m: Mode) => void
}) {
  return (
    <div className={styles.modes}>
      {["chat", "rag"].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m as Mode)}
          className={mode === m ? styles.active : ""}
        >
          {m === "chat" ? "Search Something" : "Search Documents"}
        </button>
      ))}
    </div>
  )
}
