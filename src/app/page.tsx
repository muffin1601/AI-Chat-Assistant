import Sidebar from "@/components/sidebar/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <ChatArea />
    </div>
  );
}
