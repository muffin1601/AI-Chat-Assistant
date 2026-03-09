import { NextResponse } from "next/server";
import { globalVectorStore } from "@/lib/vector-db";

export async function POST() {
    globalVectorStore.clear();
    return NextResponse.json({ success: true, message: "Vector store cleared." });
}
