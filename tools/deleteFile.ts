export default  {
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
}