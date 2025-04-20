import { Index } from '@upstash/vector';
import { Redis } from '@upstash/redis'
import { SemanticCache } from "@upstash/semantic-cache";

// Load environment variables
require('dotenv').config();

const vectorRestUrl = process.env.UPSTASH_VECTOR_REST_URL;
const vectorRestToken = process.env.UPSTASH_VECTOR_REST_TOKEN
const hfApiKey = process.env.HUGGINGFACE_API_KEY
const redisRestUrl = process.env.UPSTASH_REDIS_REST_URL
const redisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN

if (!vectorRestUrl) {
    throw new Error('UPSTASH_VECTOR_REST_URL is not set in .env file.');
}
if (!vectorRestToken) {
    throw new Error('UPSTASH_VECTOR_REST_TOKEN is not set in .env file.');
}
if (!hfApiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not set in .env file.');
}
if(!redisRestUrl){
    throw new Error('UPSTASH_REDIS_REST_URL is not set in .env file.');
}
if(!redisRestToken){
    throw new Error('UPSTASH_REDIS_REST_TOKEN is not set in .env file.');
}

const index = new Index({
    url: vectorRestUrl,
    token: vectorRestToken,
});

const redis = new Redis({
    url: redisRestUrl,
    token: redisRestToken,
})

const semanticCache = new SemanticCache({
    index: index,
    redis: redis,
    minProximity: 0.95,
});


const HUGGINGFACE_API_ENDPOINT = "https://api-inference.huggingface.co/models/all-MiniLM-L6-v2";

async function getEmbeddings(text: string): Promise<number[]> {
    const response = await fetch(
        HUGGINGFACE_API_ENDPOINT,
        {
            headers: {
                Authorization: `Bearer ${hfApiKey}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                inputs: text,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to generate embeddings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

// Function to add text and its embedding to the Upstash Vector database
export async function addToVectorDB(text: string, vectorId: string): Promise<string> {
    try {
        const embedding = await getEmbeddings(text);
        await index.upsert([{
            id: vectorId,
            vector: embedding,
            metadata: {text: text}
        }]);
        return `Text added to vector DB successfully with id ${vectorId}`;
    } catch (error: any) {
        console.error('Error adding to vector DB:', error);
        return `Could not add to vector DB. ${error.message}`;
    }
}

// Function to query the Upstash Vector database for similar entries
export async function queryVectorDB(query: string, topK: number): Promise<string> {
    try {
        const embedding = await getEmbeddings(query);
        const results = await index.query({
            vector: embedding,
            topK: topK,
            includeMetadata: true,
        });
        return `Query results: ${JSON.stringify(results)}`;
    } catch (error: any) {
        console.error('Error querying vector DB:', error);
        return `Could not query vector DB. ${error.message}`;
    }
}

export async function semanticCacheGet(key: string): Promise<string> {
    try{
        const res = await semanticCache.get(key)
        return `Semantic cache get: ${JSON.stringify(res)}`
    }catch(e:any){
        return `Semantic cache get failed: ${e.message}`
    }

}

export async function semanticCacheSet(key: string, value:string): Promise<string> {
    try{
        await semanticCache.set(key, value)
        return `Semantic cache set success`
    }catch(e:any){
        return `Semantic cache set failed: ${e.message}`
    }
}