import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
const stdlib = require('@stdlib/stdlib');
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

// Zod schema for owner and repoconst ownerRepoSchema = z.string().min(1);

async function main() {
    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });
    const toolsDir = path.join(__dirname, 'tools');
    const toolFiles = fs.readdirSync(toolsDir).filter(file => file.endsWith('.ts'));
    const tools: any[] = [];

    // Dynamically load tool configurations from the 'tools' directory
    for (const file of toolFiles) {
        try {
            const modulePath = path.join(toolsDir, file);
            const toolModule = await import(modulePath);
            // Check if the module has a default export that is a tool definition
            if (toolModule.default && typeof toolModule.default === 'object' &&
                toolModule.default.name && toolModule.default.description && toolModule.default.function) {
                tools.push({
                    name: toolModule.default.name,
                    description: toolModule.default.description,
                    function: toolModule.default.function
                });
            } else {
                console.warn(`Tool module ${file} does not have a valid default export.`);
            }
        } catch (error) {
            console.error(`Error loading tool module ${file}:`, error);
        }
    }

    // Add functions from the current file (index.ts) to the tools
    tools.push(
        { name: "listRepos", description: "Lists your repositories.", function: safeToolCall(listRepos) },
        { name: "getRepo", description: "Gets a specific repository.", function: safeToolCall(getRepo) },
        { name: "listFiles", description: "Lists files in a repository.", function: safeToolCall(listFiles) },
        { name: "readGithubFile", description: "Reads a file from Github.", function: safeToolCall(readGithubFile) },
        { name: "createRepo", description: "Creates a new repository.", function: safeToolCall(createRepo) },
        { name: "createFile", description: "Creates a new file in a repository.", function: safeToolCall(createFile) },
        { name: "updateFile", description: "Updates a file in a repository.", function: safeToolCall(updateFile) },
        { name: "deleteFile", description: "Deletes a file from a repository.", function: safeToolCall(deleteFile) },
        { name: "createIssue", description: "Creates a new issue in a repository.", function: safeToolCall(createIssue) },
        { name: "closeIssue", description: "Closes an issue in a repository.", function: safeToolCall(closeIssue) },
        { name: "getWeather", description: "Gets the weather for a location.", function: safeToolCall(getWeather) },
        { name: "getDateTime", description: "Gets the current date and time for a timezone.", function: safeToolCall(getDateTime) },
        { name: "webSearch", description: "Performs a web search.", function: safeToolCall(webSearch) },
        { name: "advancedCalculation", description: "Performs an advanced calculation.", function: safeToolCall(advancedCalculation) },
        { name: "readFile", description: "Reads a file from the local filesystem.", function: safeToolCall(readFile) },
        { name: "writeFile", description: "Writes a file to the local filesystem.", function: safeToolCall(writeFile) },
        { name: "executeCode", description: "Executes code in a sandboxed environment.", function: safeToolCall(executeCode) },
        { name: "generateImage", description: "Generates an image based on a text prompt.", function: safeToolCall(generateImage) },
        { name: "sendEmail", description: "Sends an email.", function: safeToolCall(sendEmail) },
        { name: "executeSqlQuery", description: "Executes an SQL query.", function: safeToolCall(executeSqlQuery) },
        { name: "analyzeImage", description: "Analyzes an image.", function: safeToolCall(analyzeImage) },
        { name: "scrapeWebsite", description: "Scrapes a website.", function: safeToolCall(scrapeWebsite) },
        { name: "pdfManipulate", description: "Manipulates a PDF file.", function: safeToolCall(pdfManipulate) },
        { name: "spreadsheetManipulate", description: "Manipulates a spreadsheet file.", function: safeToolCall(spreadsheetManipulate) },
        { name: "addToVectorDB", description: "Adds content to a vector database.", function: safeToolCall(addToVectorDB) },
        { name: "queryVectorDB", description: "Queries a vector database.", function: safeToolCall(queryVectorDB) },
        { name: "semanticCacheGet", description: "Retrieves a value from the semantic cache.", function: safeToolCall(semanticCacheGet) },
        { name: "semanticCacheSet", description: "Sets a value in the semantic cache.", function: safeToolCall(semanticCacheSet) },
        { name: "processMedia", description: "Processes a media file.", function: safeToolCall(processMedia) }
    );

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash', generation_config: { temperature: 0.7 } });

    const chat = model.startChat({
        history: [],
        generationConfig: {
            temperature: 0.7,
        },
    });

    let prompt = `You are RaidenNodeAgent, a versatile AI assistant designed to automate tasks across various domains such as data retrieval, file manipulation, and communication. You have access to a suite of tools that enable you to interact with GitHub, fetch weather information, perform web searches, execute code, generate images, send emails, and more. Your primary goal is to understand user requests and utilize the appropriate tools to fulfill those requests efficiently and accurately. When using a tool, you should always check if the response is an error, before proceeding. If there is an error, report it to the user, without trying to use other tools. If there is no error, continue the process with the next tool, to solve the user\'s request. Be very concise in your responses, without filler text. Use markdown formatting.`

    // Start the chat session
    while (true) {
        // Prompt the user for input
        const userInput = await new Promise((resolve) => {
            process.stdout.write('Enter your request: ');
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim());
            });
        });

        if (userInput.toLowerCase() === "exit") {
            console.log("Exiting RaidenNodeAgent.");
            break;
        }

        // Send the user input to the model
        const result = await chat.sendMessage(userInput, {
            tools: tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                function: tool.function // Use the safeToolCall wrapped function
            }))
        });

        // Log the tool calls
        if (result.toolCalls) {
            console.log("Tool calls:", result.toolCalls);
        }

        const response = result.response;
        console.log(response.text());
    }
}

// Helper function to wrap tool calls with error handling
function safeToolCall(toolFunction: Function) {
    return async function (...args: any) {
        try {
            console.log(`Tool "${toolFunction.name}" is running...`);
            const result = await toolFunction(...args);
            console.log(`Tool "${toolFunction.name}" result:`, result);
            if (result && result.error) {
                console.error(`Tool "${toolFunction.name}" reported an error:`, result.error);
            }
            return result;
        } catch (error: any) {
            console.error(`Error in tool "${toolFunction.name}":`, error);
            return { error: `Tool "${toolFunction.name}" failed: ` + error.message };
        }
    };
}

main().catch(err => console.error("RaidenNodeAgent failed to start:", err));