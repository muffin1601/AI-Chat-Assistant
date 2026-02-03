import ChatShell from "@/components/chat/ChatShell"
import styles from "./page.module.css"

export default function Page() {
  return (
    <div className={styles.page}>
      <ChatShell />
    </div>
  )
}
