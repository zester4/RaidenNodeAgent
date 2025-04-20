export default  {
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
}