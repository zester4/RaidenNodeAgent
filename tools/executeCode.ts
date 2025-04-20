export default  {
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
}