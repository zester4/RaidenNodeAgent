import { z } from 'zod';

export const tools = [
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
            },
            {
                name: 'listRepos',
                description: 'Lists all repositories for a given username',
                parameters: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The GitHub username',
                        },
                    },
                    required: ['username'],
                },
            },
            {
                name: 'getRepo',
                description: 'Gets information about a specific repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                    },
                    required: ['owner', 'repo'],
                },
            },
            {
                name: 'listFiles',
                description: 'Lists files in a repository at a given path',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        path: {
                            type: 'string',
                            description: 'The path to list files in',
                        },
                    },
                    required: ['owner', 'repo', 'path'],
                },
            },
            {
                name: 'readFile',
                description: 'Reads the contents of a file in a repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        path: {
                            type: 'string',
                            description: 'The path to the file to read',
                        },
                    },
                    required: ['owner', 'repo', 'path'],
                },
            },
            {
                name: 'createRepo',
                description: 'Creates a new repository',
                parameters: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the repository to create',
                        },
                        description: {
                            type: 'string',
                            description: 'A description of the repository',
                        },
                        privateRepo: {
                            type: 'boolean',
                            description: 'Whether the repository should be private',
                        },
                    },
                    required: ['name', 'description', 'privateRepo'],
                },
            },
            {
                name: 'createFile',
                description: 'Creates a new file in a repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        path: {
                            type: 'string',
                            description: 'The path to the file to create',
                        },
                        content: {
                            type: 'string',
                            description: 'The content of the file',
                        },
                        message: {
                            type: 'string',
                            description: 'The commit message',
                        },
                    },
                    required: ['owner', 'repo', 'path', 'content', 'message'],
                },
            },
            {
                name: 'updateFile',
                description: 'Updates an existing file in a repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        path: {
                            type: 'string',
                            description: 'The path to the file to update',
                        },
                        content: {
                            type: 'string',
                            description: 'The new content of the file',
                        },
                        message: {
                            type: 'string',
                            description: 'The commit message',
                        },
                    },
                    required: ['owner', 'repo', 'path', 'content', 'message'],
                },
            },
            {
                name: 'deleteFile',
                description: 'Deletes a file in a repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        path: {
                            type: 'string',
                            description: 'The path to the file to delete',
                        },
                        message: {
                            type: 'string',
                            description: 'The commit message',
                        },
                    },
                    required: ['owner', 'repo', 'path', 'message'],
                },
            },
            {
                name: 'createIssue',
                description: 'Creates a new issue in a repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the issue',
                        },
                        body: {
                            type: 'string',
                            description: 'The body of the issue',
                        },
                    },
                    required: ['owner', 'repo', 'title', 'body'],
                },
            },
            {
                name: 'closeIssue',
                description: 'Closes an issue in a repository',
                parameters: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository',
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository',
                        },
                        issueNumber: {
                            type: 'number',
                            description: 'The number of the issue to close',
                        },
                    },
                    required: ['owner', 'repo', 'issueNumber'],
                }
            }
        ]
    }
];