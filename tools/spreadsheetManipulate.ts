export default  {
    name: 'spreadsheetManipulate',
    description: 'Performs manipulations on a spreadsheet file',
    parameters: {
        type: 'object',
        properties: {
            operation: {
                type: 'string',
                description: 'The operation to perform (read or write)',
            },
            filePath: {
                type: 'string',
                description: 'The path to the spreadsheet file',
            },
            data: {
                type: 'string',
                description: 'The data to write to the spreadsheet (for "write" operation)',
            },
        },
        required: ['operation', 'filePath', 'data'],
    },
}
