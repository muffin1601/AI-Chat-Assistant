import styles from "./Message.module.css";
import ReactMarkdown from "react-markdown";

export default function Message({
  role,
  content,
  streaming,
}: {
  role: string;
  content: string;
  streaming?: boolean;
}) {
  const isAi = role === "assistant";

  return (
    <div className={`${styles.row} ${!isAi ? styles.rowUser : ""}`}>
      <div className={`${styles.avatar} ${isAi ? styles.avatarAi : styles.avatarUser}`}>
        {isAi ? "V" : "U"}
      </div>

      <div className={`${styles.bubble} ${isAi ? styles.bubbleAi : styles.bubbleUser}`}>
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              if (typeof children === "string") {
                const parts = children.split(/(\[Source: [^\]]+\])/);
                return (
                  <p>
                    {parts.map((part, i) =>
                      part.startsWith("[Source: ") ? (
                        <span key={i} className={styles.citation}>{part}</span>
                      ) : part
                    )}
                  </p>
                );
              }
              return <p>{children}</p>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
        {streaming && <span className={styles.cursor} />}
      </div>
    </div>
  );
}
