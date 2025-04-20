export default  {
    name: 'semanticCacheSet',
    description: 'store content into the cache',
    parameters: {
        type: 'object',
        properties: {
            key: {
                type: 'string',
                description: 'The key to store content into cache',
            },
            value: {
                type: 'string',
                description: 'The content to store into cache',
            },
        },
        required: ['key', 'value'],
    },
}