import styles from "./Sidebar.module.css"

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>OWO.AI</div>

      <nav className={styles.nav}>
        <a className={styles.active}>Home</a>
        <a>Performance</a>
        <a>Library</a>
        <a>Notes</a>
      </nav>

      <div className={styles.footer}>
        <button className={styles.upgrade}>
          Get Fufufafa 5.1 free for you!
        </button>
      </div>
    </aside>
  )
}
