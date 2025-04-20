import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
const stdlib = require( '@stdlib/stdlib' );

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
import { tools } from './toolsConfig';
import { executeSqlQuery } from './sqlQueryTools'
import { analyzeImage } from './imageRecognitionTools'
import { scrapeWebsite } from './webScrapingTools'

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

    const config = {
        tools,
        responseMimeType: 'text/plain',
        systemInstruction: [
            {
                text: `You are Raiden, a powerful thunder god with access to tools. You can use these tools to provide weather information, date/time information, perform web searches, perform advanced calculations, generate images, interact with the file system, execute code, send emails, interact with GitHub and execute SQL queries and scrape websites. Be extremely careful when using file system access and code execution tools, as they can be very dangerous. When creating or updating files, use appropriate commit messages. You can now execute SQL queries and analyze images and scrape websites!`,        
            }
        ],
    };

    const model = 'gemini-2.5-pro-preview-03-25';

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

            if (functionName === 'getWeather') {
                const location = args.location;
                const weather = await getWeather(location);
                console.log(weather);
            } else if (functionName === 'getDateTime') {
                const timezone = args.timezone;
                const dateTime = await getDateTime(timezone);
                console.log(dateTime);
            } else if (functionName === 'webSearch') {
                const query = args.query;
                const searchResults = await webSearch(query);
                console.log(searchResults);
            } else if (functionName === 'advancedCalculation') {
                const expression = args.expression;
                const calculationResult = await advancedCalculation(expression);
                console.log(calculationResult);
            } else if (functionName === 'readFile') {
                const filePath = args.filePath;
                const fileContents = await readFile(filePath);
                console.log(fileContents);
            } else if (functionName === 'writeFile') {
                const filePath = args.filePath;
                const content = args.content;
                const writeResult = await writeFile(filePath, content);
                console.log(writeResult);
            } else if (functionName === 'executeCode') {
                const code = args.code;
                const executionResult = await executeCode(code);
                console.log(executionResult);
            } else if (functionName === 'generateImage') {
                const prompt = args.prompt;
                const imageResult = await generateImage(prompt);
                console.log(imageResult)
            } else if (functionName === 'sendEmail') {
                const to = args.to;
                const subject = args.subject;
                const body = args.body;
                const emailResult = await sendEmail(to, subject, body);
                console.log(emailResult);
            } else if (functionName === 'listRepos') {
                const username = args.username;
                const repoList = await listRepos(username);
                console.log(repoList);
            } else if (functionName === 'getRepo') {
                const owner = args.owner;
                const repo = args.repo;
                const repoInfo = await getRepo(owner, repo);
                console.log(repoInfo);
            } else if (functionName === 'listFiles') {
                const owner = args.owner;
                const repo = args.repo;
                const path = args.path;
                const fileList = await listFiles(owner, repo, path);
                console.log(fileList);
            } else if (functionName === 'readFile') {
                const owner = args.owner;
                const repo = args.repo;
                const path = args.path;
                const fileContent = await readGithubFile(owner, repo, path);
                console.log(fileContent);
            } else if (functionName === 'createRepo') {
                const name = args.name;
                const description = args.description;
                const privateRepo = args.privateRepo;
                const creationResult = await createRepo(name, description, privateRepo);
                console.log(creationResult);
            } else if (functionName === 'createFile') {
                const owner = args.owner;
                const repo = args.repo;
                const path = args.path;
                const content = args.content;
                const message = args.message;
                const creationResult = await createFile(owner, repo, path, content, message);
                console.log(creationResult);
            } else if (functionName === 'updateFile') {
                const owner = args.owner;
                const repo = args.repo;
                const path = args.path;
                const content = args.content;
                const message = args.message;
                const updateResult = await updateFile(owner, repo, path, content, message);
                console.log(updateResult);
            } else if (functionName === 'deleteFile') {
                const owner = args.owner;
                const repo = args.repo;
                const path = args.path;
                const message = args.message;
                const deletionResult = await deleteFile(owner, repo, path, message);
                console.log(deletionResult);
            } else if (functionName === 'createIssue') {
                const owner = args.owner;
                const repo = args.repo;
                const title = args.title;
                const body = args.body;
                const creationResult = await createIssue(owner, repo, title, body);
                console.log(creationResult);
            }  else if (functionName === 'closeIssue') {
                const owner = args.owner;
                const repo = args.repo;
                const issueNumber = args.issueNumber;
                const closingResult = await closeIssue(owner, repo, issueNumber);
                console.log(closingResult);
            } else if (functionName === 'executeSqlQuery') {
                const databasePath = args.databasePath;
                const query = args.query;
                const queryResult = await executeSqlQuery(databasePath, query);
                console.log(queryResult);
            }  else if (functionName === 'analyzeImage') {
                const imagePath = args.imagePath
                const features = args.features
                const imageResult = await analyzeImage(imagePath, features)
                console.log(imageResult)
            } else if (functionName === 'scrapeWebsite') {
                const url = args.url
                const type = args.type
                const scrapeResult = await scrapeWebsite(url, type)
                console.log(scrapeResult)
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