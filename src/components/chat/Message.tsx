import styles from "./Message.module.css";

export default function Message({
  role,
  content,
  streaming,
}: {
  role: string;
  content: string;
  streaming?: boolean;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        {role === "assistant" ? "AI" : "U"}
      </div>

      <div className={styles.bubble}>
        {content}
        {streaming && <span className={styles.cursor}>▍</span>}
      </div>
    </div>
  );
}
