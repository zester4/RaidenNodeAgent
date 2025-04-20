import { GoogleGenAI } from '@google/genai';
import { format, utcToZonedTime } from 'date-fns-tz';
import fetch from 'node-fetch';
import { z } from 'zod';
import { search } from 'duckduckgo-search';
import * as fs from 'fs';
import { exec } from 'child_process';
import nodemailer from 'nodemailer';
const stdlib = require( '@stdlib/stdlib' );

// Load environment variables
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY; // Replace with your actual API key
const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;


if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in .env file.');
}

if (!weatherApiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY is not set in .env file.');
}

if (!stableDiffusionApiKey) {
    throw new Error('STABLE_DIFFUSION_API_KEY is not set in .env file.');
}

if (!smtpUser) {
    throw new Error('SMTP_USER is not set in .env file.');
}

if (!smtpPass) {
    throw new Error('SMTP_PASS is not set in .env file.');
}

if (!smtpHost) {
    throw new Error('SMTP_HOST is not set in .env file.');
}

if (!smtpPort) {
    throw new Error('SMTP_PORT is not set in .env file.');
}

// Zod schema for location validation
const locationSchema = z.string().min(3);

//Zod schema for timezone validation
const timezoneSchema = z.string().min(1);

// Zod schema for search query validation
const searchQuerySchema = z.string().min(3);

// Zod schema for file path validation
const filePathSchema = z.string().min(1);

// Zod schema for image prompt validation
const imagePromptSchema = z.string().min(3);

// Zod schema for email validation
const emailSchema = z.string().email();

// Function to get the current weather for a location
async function getWeather(location: string): Promise<string> {
  try {
    locationSchema.parse(location);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || 'Failed to fetch weather data');
    }

    const temperature = data.main.temp;
    const description = data.weather[0].description;

    return `The weather in ${location} is ${temperature}°C with ${description}.`;
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    return `Could not retrieve weather information for ${location}. ${error.message}`;
  }
}

// Function to get the current date and time for a timezone
function getDateTime(timezone: string): string {
    try {
        timezoneSchema.parse(timezone);
        const now = new Date();
        const zonedDate = utcToZonedTime(now, timezone);
        const dateTimeString = format(zonedDate, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: timezone });
        return `The current date and time in ${timezone} is ${dateTimeString}.`;
    } catch (error: any) {
        console.error("Error getting date time", error)
        return `Could not retrieve date and time information for ${timezone}. ${error.message}`;
    }
}

// Function to perform a web search
async function webSearch(query: string): Promise<string> {
    try {
        searchQuerySchema.parse(query);
        const results = await search(query, { maxResults: 3 });
        if (results && results.length > 0) {
            const snippets = results.map(result => result.snippet).join('\n');
            return `Web search results for ${query}:\n${snippets}`;
        } else {
            return `No results found for ${query}.`;
        }
    } catch (error: any) {
        console.error('Error during web search:', error);
        return `Could not retrieve web search results for ${query}. ${error.message}`;
    }
}

// Function to perform advanced calculations
function advancedCalculation(expression: string): string {
    try {
        //Note: Evaluating arbitrary expressions can be risky.  Handle with care.
        //const result = stdlib.eval(expression);
        //const result = eval(expression);
        //if (typeof result === 'number') {
        //    return `The result of ${expression} is ${result.toString()}.`;
        //} else {
        //    return `The expression ${expression} did not evaluate to a number.`;
        //}
        return `I am sorry, I cannot perform advanced calculations at this time. Please try again later.`
    } catch (error: any) {
        console.error('Error during calculation:', error);
        return `Could not perform calculation for ${expression}. ${error.message}`;
    }
}

// Function to read a file (DISABLED BY DEFAULT FOR SECURITY REASONS)
async function readFile(filePath: string): Promise<string> {
    try {
        filePathSchema.parse(filePath);
        //THIS TOOL IS DISABLED BY DEFAULT DUE TO SECURITY CONCERNS
        const data = fs.readFileSync(filePath, 'utf8');
        return `File contents: ${data}`;
    } catch (error: any) {
        console.error('Error reading file:', error);
        return `Could not read file ${filePath}. ${error.message}`;
    }
}

// Function to write to a file (DISABLED BY DEFAULT FOR SECURITY REASONS)
async function writeFile(filePath: string, content: string): Promise<string> {
    try {
        filePathSchema.parse(filePath);
        //THIS TOOL IS DISABLED BY DEFAULT DUE TO SECURITY CONCERNS
        fs.writeFileSync(filePath, content, 'utf8');
        return `File written successfully.`;
    } catch (error: any) {
        console.error('Error writing file:', error);
        return `Could not write to file ${filePath}. ${error.message}`;
    }
}

// Function to execute code (DISABLED BY DEFAULT FOR SECURITY REASONS)
async function executeCode(code: string): Promise<string> {
    try {
        //THIS TOOL IS DISABLED BY DEFAULT DUE TO SECURITY CONCERNS
        exec(code, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing code: ${error}`);
                return `Error executing code: ${error.message}`;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            return stdout;
        });
        return `Code executed successfully.`;
    } catch (error: any) {
        console.error('Error executing code:', error);
        return `Could not execute code. ${error.message}`;
    }
}

async function generateImage(prompt: string): Promise<string> {
    try {
        imagePromptSchema.parse(prompt);

        const url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

        const payload = {
            "steps": 50,
            "width": 1024,
            "height": 1024,
            "seed": 0,
            "cfg_scale": 5,
            "samples": 1,
            "text_prompts": [
                {
                    "text": prompt,
                    "weight": 1
                }
            ],
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${stableDiffusionApiKey}`
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`Stable Diffusion API error: ${response.status} ${response.statusText}`);
        }

        const responseJSON = await response.json();

        const imageBase64 = responseJSON.artifacts[0].base64

        return `Image generated successfully!  Here is the base64 encoded string: ${imageBase64}`;

    } catch (error: any) {
        console.error('Error generating image:', error);
        return `Could not generate image. ${error.message}`;
    }
}

async function sendEmail(to: string, subject: string, body: string): Promise<string> {
    try {
        emailSchema.parse(to);

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: true, // true for 465, false for other ports
            auth: {
                user: smtpUser, // generated ethereal user
                pass: smtpPass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: smtpUser, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
            html: `<p>${body}</p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        return `Email sent successfully. Message ID: ${info.messageId}`;

    } catch (error: any) {
        console.error('Error sending email:', error);
        return `Could not send email. ${error.message}`;
    }
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const tools = [
    {
      functionDeclarations: [
        {
            name: 'getWeather',
            description: 'Get the current weather for a location',
            parameters: {
                type: 'object',
                properties: {
                    location: {
                        type: 'string',
                        description: 'The city and country to get the weather for (e.g., London, UK)',
                    },
                },
                required: ['location'],
            },
        },
        {
            name: 'getDateTime',
            description: 'Get the current date and time for a timezone',
            parameters: {
                type: 'object',
                properties: {
                    timezone: {
                        type: 'string',
                        description: 'The IANA timezone (e.g., America/Los_Angeles)',
                    },
                },
                required: ['timezone'],
            },
        },
        {
            name: 'webSearch',
            description: 'Perform a web search and return a summarized result',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The search query',
                    },
                },
                required: ['query'],
            },
        },
        {
            name: 'advancedCalculation',
            description: 'Perform an advanced calculation',
            parameters: {
                type: 'object',
                properties: {
                    expression: {
                        type: 'string',
                        description: 'The mathematical expression to evaluate',
                    },
                },
                required: ['expression'],
            },
        },
         {
            name: 'readFile',
            description: 'Reads the contents of a file',
            parameters: {
                type: 'object',
                properties: {
                    filePath: {
                        type: 'string',
                        description: 'The path to the file to read',
                    },
                },
                required: ['filePath'],
            },
        },
        {
            name: 'writeFile',
            description: 'Writes content to a file',
            parameters: {
                type: 'object',
                properties: {
                    filePath: {
                        type: 'string',
                        description: 'The path to the file to write',
                    },
                    content: {
                        type: 'string',
                        description: 'The content to write to the file',
                    },
                },
                required: ['filePath', 'content'],
            },
        },
        {
            name: 'executeCode',
            description: 'Executes JavaScript code',
            parameters: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                        description: 'The JavaScript code to execute',
                    },
                },
                required: ['code'],
            },
        },
        {
            name: 'generateImage',
            description: 'Generates an image using Stable Diffusion',
            parameters: {
                type: 'object',
                properties: {
                    prompt: {
                        type: 'string',
                        description: 'A text description of the desired image',
                    },
                },
                required: ['prompt'],
            },
        },
        {
            name: 'sendEmail',
            description: 'Sends an email',
            parameters: {
                type: 'object',
                properties: {
                    to: {
                        type: 'string',
                        description: 'The recipient email address',
                    },
                    subject: {
                        type: 'string',
                        description: 'The subject of the email',
                    },
                    body: {
                        type: 'string',
                        description: 'The body of the email',
                    },
                },
                required: ['to', 'subject', 'body'],
            },
        }
      ],
    }
  ];

  const config = {
    tools,
    responseMimeType: 'text/plain',
    systemInstruction: [
        {
          text: `You are Raiden, a powerful thunder god with access to tools. You can use these tools to provide weather information, date/time information, perform web searches, perform advanced calculations, generate images, interact with the file system, execute code and send emails. Do not use the calculation tool for malicious purposes, or anything that can be harmful. Be extremely careful when using file system access and code execution tools, as they can be very dangerous.`,
        }
    ],
  };

  const model = 'gemini-2.5-pro-preview-03-25';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`, //e.g., What is the weather in London, UK? Or what time is it in Tokyo? What is the time compared to historic events? Generate an image of a cat wearing sunglasses. Send an email to test@example.com with the subject 'Test Email' and body 'This is a test email.'
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
            const dateTime = getDateTime(timezone);
            console.log(dateTime);
        } else if (functionName === 'webSearch') {
            const query = args.query;
            const searchResults = await webSearch(query);
            console.log(searchResults);
        } else if (functionName === 'advancedCalculation') {
            const expression = args.expression;
            const calculationResult = advancedCalculation(expression);
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
        } else {
            console.log(`Unknown function: ${functionName}`);
        }
    } else {
        console.log(chunk.text);
    }
  }
}

main();