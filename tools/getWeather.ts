export default  {
    name: 'getWeather',
    description: 'Get the current weather for a location',
    parameters: {
        type: 'object',
        properties: {
            location: {
                type: 'string',
                description: 'The city and country to get the weather for (e.g., London, UK)',
            },
        },
        required: ['location'],
    },
}