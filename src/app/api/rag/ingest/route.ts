import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { chunkDocument } from "@/lib/rag-utils";
import { globalVectorStore } from "@/lib/vector-db";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "test-data/nexus_logistics_2026.txt");
        const text = fs.readFileSync(filePath, "utf-8");

        const chunks = await chunkDocument(text);

        await globalVectorStore.addDocuments(chunks.map(c => ({
            pageContent: c.pageContent,
            metadata: { source: "nexus_logistics_2026.txt", ...c.metadata }
        })));

        return NextResponse.json({
            success: true,
            message: `Successfully ingested ${chunks.length} chunks from Nexus Logistics 2026 plan.`
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
