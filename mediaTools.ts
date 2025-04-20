import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import fs from 'fs/promises'

// Function to process media files
export async function processMedia(filePath: string): Promise<string> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in .env file.');
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        //const mimeType = mime.lookup(filePath);

        const fileBuffer = await fs.readFile(filePath)

        const mimeType = mime.getType(filePath) || 'application/octet-stream';

        const file = await ai.files.upload({
            file: fileBuffer,
            mimeType: mimeType
        })

        return `Media processed successfully. File URI: ${file.uri} and Mime Type: ${file.mimeType}`;

    } catch (error: any) {
        console.error('Error processing media:', error);
        return `Could not process media. ${error.message}`;
    }
}