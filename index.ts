import { GoogleGenAI } from '@google/genai';
import { format, utcToZonedTime } from 'date-fns-tz';
import fetch from 'node-fetch';
import { z } from 'zod';
import { search } from 'duckduckgo-search';
const stdlib = require( '@stdlib/stdlib' );

// Load environment variables
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY; // Replace with your actual API key

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in .env file.');
}

if (!weatherApiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY is not set in .env file.');
  }

// Zod schema for location validation
const locationSchema = z.string().min(3);

//Zod schema for timezone validation
const timezoneSchema = z.string().min(1);

// Zod schema for search query validation
const searchQuerySchema = z.string().min(3);

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
        }
      ],
    }
  ];

  const config = {
    tools,
    responseMimeType: 'text/plain',
    systemInstruction: [
        {
          text: `You are Raiden, a powerful thunder god with access to tools. You can use these tools to provide weather information, date/time information, perform web searches, and perform advanced calculations. Do not use the calculation tool for malicious purposes, or anything that can be harmful.`,
        }
    ],
  };

  const model = 'gemini-2.5-pro-preview-03-25';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`, //e.g., What is the weather in London, UK? Or what time is it in Tokyo? Or what is the time? How does it compared to historic events? ${stdlib.time()}`,
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
        } else {
            console.log(`Unknown function: ${functionName}`);
        }
    } else {
        console.log(chunk.text);
    }
  }
}

main();