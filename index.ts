// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {  GoogleGenAI,} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const tools = [
    {
      functionDeclarations: [
      ],
    }
  ];

  const config = {
    tools,
    responseMimeType: 'text/plain',
    systemInstruction: [
        {
          text: `You are Raiden a powerful thunder god with tools...`,
        }
    ],
  };

  const model = 'gemini-2.5-pro-preview-03-25';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
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
    console.log(chunk.functionCalls ? chunk.functionCalls[0] : chunk.text);
  }
}

main();