import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { chunkDocument } from "@/lib/rag-utils";
import { globalVectorStore } from "@/lib/vector-db";

export async function GET() {
    try {
        const testDataDir = path.join(process.cwd(), "test-data");
        const files = fs.readdirSync(testDataDir);
        let totalChunks = 0;

        for (const fileName of files) {
            if (fileName.endsWith(".txt")) {
                const filePath = path.join(testDataDir, fileName);
                const text = fs.readFileSync(filePath, "utf-8");
                const chunks = await chunkDocument(text);

                await globalVectorStore.addDocuments(chunks.map(c => ({
                    pageContent: c.pageContent,
                    metadata: { source: fileName, ...c.metadata }
                })));
                
                totalChunks += chunks.length;
                console.log(`Ingested ${chunks.length} chunks from ${fileName}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully ingested ${totalChunks} total chunks from ${files.length} files.`
        });
    } catch (error: any) {
        console.error("Ingestion failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
