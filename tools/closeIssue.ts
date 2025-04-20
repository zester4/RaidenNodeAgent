export default  {
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
    },
}