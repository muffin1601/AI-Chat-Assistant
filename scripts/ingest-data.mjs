import fs from "fs";
import path from "path";
import { chunkDocument } from "./src/lib/rag-utils";
import { globalVectorStore } from "./src/lib/vector-db";

async function ingest() {
    console.log("Starting ingestion...");
    const filePath = path.join(process.cwd(), "test-data/nexus_logistics_2026.txt");
    const text = fs.readFileSync(filePath, "utf-8");

    console.log("Chunking document...");
    const chunks = await chunkDocument(text);

    console.log(`Adding ${chunks.length} chunks to Vector DB...`);
    await globalVectorStore.addDocuments(chunks.map(c => ({
        pageContent: c.pageContent,
        metadata: { source: "nexus_logistics_2026.txt", ...c.metadata }
    })));

    console.log("Ingestion complete!");
    process.exit(0);
}

ingest().catch(err => {
    console.error("Ingestion failed:", err);
    process.exit(1);
});
