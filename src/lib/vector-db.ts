import { supabase } from "./supabase";

export interface DocumentChunk {
    pageContent: string;
    metadata: {
        source: string;
        [key: string]: any;
    };
}

class PersistentVectorStore {
    private isClient = typeof window !== 'undefined';

    async addDocuments(docs: DocumentChunk[]) {
        if (this.isClient) return; 

        const { error } = await supabase
            .from('documents')
            .insert(docs.map(d => ({
                content: d.pageContent,
                metadata: d.metadata
            })));
        
        if (error) console.error("Error saving to Persistent Store:", error);
    }

    async similaritySearch(query: string, k: number = 3): Promise<DocumentChunk[]> {
        const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
        if (queryWords.length === 0) return [];

        // Fetch ALL documents from Supabase (since we're using keyword search for now)
        const { data: dbDocs, error } = await supabase
            .from('documents')
            .select('*');

        if (error || !dbDocs) {
            console.error("Error fetching from Persistent Store:", error);
            return [];
        }

        const scoredDocs = dbDocs.map(dbDoc => {
            let score = 0;
            const content = dbDoc.content.toLowerCase();
            
            queryWords.forEach(word => {
                // Primary: Exact word frequency
                try {
                    const regex = new RegExp(word, 'g');
                    const matches = content.match(regex);
                    if (matches) score += matches.length;
                } catch {
                    // Fallback if word contains special regex chars
                    if (content.includes(word)) score += 1;
                }

                // Secondary: Partial matching
                if (content.includes(word)) score += 0.5;
            });

            return { 
                doc: { 
                    pageContent: dbDoc.content, 
                    metadata: dbDoc.metadata 
                } as DocumentChunk, 
                score 
            };
        });

        const sortedResults = scoredDocs
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, k)
            .map(s => s.doc);

        console.log(`[RAG Search] Query: "${query}" | Found ${sortedResults.length} relevant chunks in DB.`);
        return sortedResults;
    }

    async clear() {
        const { error } = await supabase
            .from('documents')
            .delete()
            .neq('content', 'EMPTY_DOC_STUB');
        
        if (error) console.error("Error clearing Persistent Store:", error);
    }
}

export const globalVectorStore = new PersistentVectorStore();
