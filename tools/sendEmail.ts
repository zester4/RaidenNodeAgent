export default  {
    name: 'sendEmail',
    description: 'Sends an email',
    parameters: {
        type: 'object',
        properties: {
            to: {
                type: 'string',
                description: 'The recipient email address',
            },
            subject: {
                type: 'string',
                description: 'The subject of the email',
            },
            body: {
                type: 'string',
                description: 'The body of the email',
            },
        },
        required: ['to', 'subject', 'body'],
    },
}