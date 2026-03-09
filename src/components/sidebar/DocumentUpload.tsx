"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function DocumentUpload() {
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, chunks: number }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result?.toString().split(",")[1];

                const res = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileBase64: base64,
                        fileName: file.name
                    }),
                });

                const data = await res.json();
                if (data.success) {
                    setUploadedFiles(prev => [...prev, { name: file.name, chunks: data.chunkCount }]);
                } else {
                    alert("Upload failed: " + data.error);
                }
                setUploading(false);
            };
        } catch (error) {
            console.error("Upload error:", error);
            setUploading(false);
        }
    };

    const clearDocs = async () => {
        await fetch("/api/upload/clear", { method: "POST" });
        setUploadedFiles([]);
    };

    return (
        <div className={styles.uploadSection}>
            <div className={styles.section}>
                <span>Knowledge base</span>
                <button className={styles.clear} onClick={clearDocs}>
                    <X size={14} />
                </button>
            </div>

            <div className={styles.uploadContainer}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept=".pdf,.txt"
                />
                <button
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? <Loader2 className={styles.spin} size={18} /> : <Upload size={18} />}
                    {uploading ? "Processing..." : "Add Document"}
                </button>
            </div>

            <div className={styles.fileList}>
                {uploadedFiles.map((file, i) => (
                    <div key={i} className={styles.fileItem}>
                        <FileText size={14} className={styles.fileIcon} />
                        <div className={styles.fileInfo}>
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileMeta}>{file.chunks} chunks</span>
                        </div>
                        <CheckCircle2 size={14} className={styles.checkIcon} />
                    </div>
                ))}
            </div>
        </div>
    );
}
