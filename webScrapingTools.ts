import FireCrawlApp from '@mendable/firecrawl-js';

// Function to scrape websites using Firecrawl
export async function scrapeWebsite(url: string, type: string): Promise<string> {
    try {
        const apiKey = process.env.FIRECRAWL_API_KEY;

        if (!apiKey) {
            throw new Error('FIRECRAWL_API_KEY is not set in .env file.');
        }

        const app = new FireCrawlApp({ apiKey: apiKey });

        if (type === "scrape") {
            const scrapeResult = await app.scrapeUrl(url, {
                formats: ["markdown"],
            });
            return `Scrape Result: ${JSON.stringify(scrapeResult)}`
        } else if (type === "crawl") {
            const crawlResult = await app.crawlUrl(url, {
                limit: 5,
                ignoreSitemap: true,
                scrapeOptions: {
                    formats: ["markdown"],
                }
            })
            return `Crawl Result: ${JSON.stringify(crawlResult)}`
        } else {
            return "Please provide valid type either 'scrape' or 'crawl'"
        }

    } catch (error: any) {
        console.error('Error scraping website:', error);
        return `Could not scrape website. ${error.message}`;
    }
}