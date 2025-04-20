export default  {
    name: 'scrapeWebsite',
    description: 'Scrapes a website using Firecrawl',
    parameters: {
        type: 'object',
        properties: {
            url: {
                type: 'string',
                description: 'The URL of the website to scrape',
            },
            type: {
                type: 'string',
                description: 'The type of scraping to perform (scrape or crawl)',
            },
        },
        required: ['url', 'type'],
    },
}
