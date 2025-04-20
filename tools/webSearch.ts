export default  {
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
}