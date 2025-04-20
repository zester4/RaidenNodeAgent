export default  {
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
}