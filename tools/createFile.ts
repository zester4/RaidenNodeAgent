export default  {
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
}