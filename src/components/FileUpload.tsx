"use client"

import { FileText } from "lucide-react"
import styles from "@/app/page.module.css"

type Props = {
  onUpload: (file: File | null) => void
}

export default function FileUpload({ onUpload }: Props) {
  return (
    <div className={styles.uploadBox}>
      <label>
        <FileText size={14} /> Upload PDF (used for answers)
      </label>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
