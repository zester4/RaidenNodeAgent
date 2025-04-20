export default  {
    name: 'readGithubFile',
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
}