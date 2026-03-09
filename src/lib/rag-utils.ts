import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    // Use dynamic require to bypass Next.js Turbopack ESM static analysis
    const pdf = require("pdf-parse");
    const data = await pdf(buffer);
    return data.text;
}

export async function chunkDocument(text: string, chunkSize = 1000, chunkOverlap = 200) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });

    const docs = await splitter.createDocuments([text]);
    return docs;
}
