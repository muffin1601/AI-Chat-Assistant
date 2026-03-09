
export interface DocumentChunk {
    pageContent: string;
    metadata: {
        source: string;
        [key: string]: any;
    };
}
 
class InMemoryVectorStore {
    private documents: DocumentChunk[] = [];

    addDocuments(docs: DocumentChunk[]) {
        this.documents.push(...docs);
    }

    async similaritySearch(query: string, k: number = 3): Promise<DocumentChunk[]> {
        const queryWords = query.toLowerCase().split(/\W+/);

        const scoredDocs = this.documents.map(doc => {
            let score = 0;
            const content = doc.pageContent.toLowerCase();
            queryWords.forEach(word => {
                if (word.length > 2 && content.includes(word)) score++;
            });
            return { doc, score };
        });

        return scoredDocs
            .sort((a, b) => b.score - a.score)
            .slice(0, k)
            .map(s => s.doc);
    }

    clear() {
        this.documents = [];
    }

    getCount() {
        return this.documents.length;
    }
}

export const globalVectorStore = new InMemoryVectorStore();
