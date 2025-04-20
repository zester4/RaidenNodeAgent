export default  {
    name: 'queryVectorDB',
    description: 'Queries the Upstash Vector database for similar entries',
    parameters: {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'The search query',
            },
            topK: {
                type: 'number',
                description: 'The number of results to return',
            },
        },
        required: ['query', 'topK'],
    },
}