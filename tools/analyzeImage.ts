export default  {
    name: 'analyzeImage',
    description: 'Analyzes an image using AWS Rekognition',
    parameters: {
        type: 'object',
        properties: {
            imagePath: {
                type: 'string',
                description: 'The path to the image file',
            },
            features: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['labels', 'faces', 'text', 'moderation']
                },
                description: 'An array of features to analyze (e.g., ["labels", "faces"])',
            },
        },
        required: ['imagePath', 'features'],
    },
}
