import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF, chunkDocument } from "@/lib/rag-utils";
import { globalVectorStore } from "@/lib/vector-db";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json();
        const { fileBase64, fileName } = formData;

        if (!fileBase64) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(fileBase64, 'base64');

        let text = "";
        if (fileName.endsWith(".pdf")) {
            text = await extractTextFromPDF(buffer);
        } else {
            text = buffer.toString('utf-8');
        }

        const chunks = await chunkDocument(text);

        globalVectorStore.addDocuments(chunks.map((c: any) => ({
            pageContent: c.pageContent,
            metadata: { ...c.metadata, source: fileName }
        })));

        return NextResponse.json({
            success: true,
            message: `Processed ${chunks.length} chunks from ${fileName}`,
            chunkCount: chunks.length,
            totalDocuments: globalVectorStore.getCount()
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
