import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
const stdlib = require( '@stdlib/stdlib' );
import fs from 'fs';
import path from 'path';

// Import tool modules
import { listRepos, getRepo, listFiles, readGithubFile, createRepo, createFile, updateFile, deleteFile, createIssue, closeIssue } from './githubTools';
import { getWeather } from './weatherTools';
import { getDateTime } from './timeTools';
import { webSearch } from './searchTools';
import { advancedCalculation } from './calculationTools';
import { readFile, writeFile } from './fileTools';
import { executeCode } from './codeExecutionTools';
import { generateImage } from './imageGenerationTools';
import { sendEmail } from './emailTools';
import { executeSqlQuery } from './sqlQueryTools'
import { analyzeImage } from './imageRecognitionTools'
import { scrapeWebsite } from './webScrapingTools'
import { pdfManipulate } from './pdfTools'
import { spreadsheetManipulate } from './spreadsheetTools'
import { addToVectorDB, queryVectorDB, semanticCacheGet, semanticCacheSet } from './vectorDBTools'
import { processMedia } from './mediaTools'

// Load environment variables
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in .env file.');
}

// Zod schema for owner and repo
const ownerRepoSchema = z.string().min(1);

async function main() {
    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });

     // Dynamically load tool configurations from the 'tools' directory
     const toolsDir = path.join(__dirname, 'tools');
     const toolFiles = fs.readdirSync(toolsDir).filter(file => file.endsWith('.ts'));

    const tools = [
        {name: "listRepos", description: "Lists your repositories.", function: listRepos},
        {name: "getRepo", description: "Gets a specific repository.", function: getRepo},
        {name: "listFiles", description: "Lists files in a repository.", function: listFiles},
        {name: "readGithubFile", description: "Reads a file from Github.", function: readGithubFile},
        {name: "createRepo", description: "Creates a new repository.", function: createRepo},
        {name: "createFile", description: "Creates a new file in a repository.", function: createFile},
        {name: "updateFile", description: "Updates a file in a repository.", function: updateFile},
        {name: "deleteFile", description: "Deletes a file from a repository.", function: deleteFile},
        {name: "createIssue", description: "Creates a new issue in a repository.", function: createIssue},
        {name: "closeIssue", description: "Closes an issue in a repository.", function: closeIssue},
        {name: "getWeather", description: "Gets the weather for a location.", function: getWeather},
        {name: "getDateTime", description: "Gets the current date and time for a timezone.", function: getDateTime},
        {name: "webSearch", description: "Performs a web search.", function: webSearch},
        {name: "advancedCalculation", description: "Performs an advanced calculation.", function: advancedCalculation},
        {name: "readFile", description: "Reads a file from the file system.", function: readFile},
        {name: "writeFile", description: "Writes a file to the file system.", function: writeFile},
        {name: "executeCode", description: "Executes code.", function: executeCode},
        {name: "generateImage", description: "Generates an image based on a prompt.", function: generateImage},
        {name: "sendEmail", description: "Sends an email.", function: sendEmail},
        {name: "executeSqlQuery", description: "Executes an SQL query.", function: executeSqlQuery},
        {name: "analyzeImage", description: "Analyzes an image.", function: analyzeImage},
        {name: "scrapeWebsite", description: "Scrapes a website.", function: scrapeWebsite},
        {name: "pdfManipulate", description: "Manipulates a PDF file.", function: pdfManipulate},
        {name: "spreadsheetManipulate", description: "Manipulates a spreadsheet.", function: spreadsheetManipulate},
        {name: "addToVectorDB", description: "Adds text to the vector database.", function: addToVectorDB},
        {name: "queryVectorDB", description: "Queries the vector database.", function: queryVectorDB},
        {name: "semanticCacheGet", description: "Retrieves data from the semantic cache.", function: semanticCacheGet},
        {name: "semanticCacheSet", description: "Stores data in the semantic cache.", function: semanticCacheSet},
        {name: "processMedia", description: "Processes media files.", function: processMedia}
    ];

    const config = {
        tools,
        responseMimeType: 'text/plain',
        systemInstruction: [
            {
                text: `You are Raiden, a powerful thunder god with access to tools. You can use these tools to provide weather information, date/time information, perform web searches, perform advanced calculations, generate images, interact with the file system, execute code, send emails, interact with GitHub and execute SQL queries and scrape websites, manipulate pdfs and spreadsheets and process media. Be extremely careful when using file system access and code execution tools, as they can be very dangerous. When creating or updating files, use appropriate commit messages. You can now execute SQL queries and analyze images and scrape websites and manipulate pdfs and spreadsheets and can handle various types of media!`,        
            }
        ],
    };

    const model = 'gemini-2.0-flash';

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `INSERT_INPUT_HERE`, //e.g., What is the weather in London, UK? Or what time is it in Tokyo? What is the time compared to historic events? Generate an image of a cat wearing sunglasses. Send an email to test@example.com with the subject 'Test Email' and body 'This is a test email.' List my repos. What is the content of the index.ts file.
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });

    for await (const chunk of response) {
        if (chunk.functionCalls) {
            const functionName = chunk.functionCalls[0].name;
            const args = chunk.functionCalls[0].args;

            // Find the tool based on the function name
            const tool = tools.find(tool => tool.name === functionName);

            if (tool) {
                try {
                    // Call the tool's function with the provided arguments
                    const result = await tool.function(args); // Assuming all functions accept a single 'args' object
                    console.log(result);
                } catch (error) {
                    console.error(`Error executing tool ${functionName}:`, error);
                }
            } else {
                console.log(`Unknown function: ${functionName}`);
            }
        }
        else {
            console.log(chunk.text);
        }
    }
}

main();