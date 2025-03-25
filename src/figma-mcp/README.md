# Serper MCP Server

An MCP server implementation that integrates with the Serper API, providing comprehensive web, news, image, and video search capabilities through Google search results. Additionally, it includes web scraping functionality using FireCrawl to extract content from search results, and location-based services.

## Features

- **Web Search**: General queries, knowledge graphs, people also ask, and more
- **News Search**: Articles, press releases, and timely content with source information
- **Image Search**: Photos, diagrams, logos, and other visual content
- **Video Search**: Videos from YouTube and other platforms
- **Maps Search**: Places, businesses, and points of interest with detailed information
- **Reviews Search**: Detailed user reviews and ratings for businesses and places
- **Web Scraping**: Extract and format content from any web page found in search results
- **Location Services**: Get current GPS coordinates for location-aware searches
- **Location-Based Results**: Country and location-specific search capability
- **Rich Result Formatting**: Structured data from knowledge graphs and answer boxes

## Tools

- **serper_web_search**
  - Execute web searches with location context
  - Inputs:
    - `query` (string): Search terms
    - `location` (string, optional): Location context (e.g., "United States", "India")
    - `gl` (string, optional): Google country code (e.g., "us", "in", "uk")
    - `num` (number, optional): Number of results (max 20)

- **serper_news_search**
  - Search for news articles and press releases
  - Inputs:
    - `query` (string): News search terms
    - `location` (string, optional): Location context 
    - `gl` (string, optional): Google country code
    - `num` (number, optional): Number of results (max 20)

- **serper_image_search**
  - Search for images, photos, diagrams, and visual content
  - Inputs:
    - `query` (string): Image search terms
    - `gl` (string, optional): Google country code (e.g., "us", "in", "uk")
    - `num` (number, optional): Number of results (max 20)

- **serper_video_search**
  - Search for videos from YouTube and other platforms
  - Inputs:
    - `query` (string): Video search terms
    - `gl` (string, optional): Google country code (e.g., "us", "in", "uk")
    - `num` (number, optional): Number of results (max 20)

- **serper_maps_search**
  - Search for places, businesses, and points of interest
  - Inputs:
    - `query` (string): Place or business search terms
    - `ll` (string, optional): Location coordinates in format '@latitude,longitude,zoom' (e.g. '@40.6973709,-74.1444871,11z')
    - `useCurrentLocation` (boolean, optional): Whether to use current IP-based location if no coordinates provided (default: true)
    - `num` (number, optional): Number of results (max 20)
  - Returns:
    - Business names and addresses
    - Geographic coordinates
    - Ratings and reviews
    - Business types and categories
    - Contact information when available

- **serper_reviews_search**
  - Retrieve detailed reviews for a specific place or business
  - Inputs:
    - `placeId` (string): Google Place ID (required, obtain from maps search)
    - `cid` (string, optional): Google Customer ID (from maps search)
    - `fid` (string, optional): Google Featured ID (from maps search)
    - `sortBy` (string, optional): How to sort reviews ("mostRelevant", "newest", "highestRating", "lowestRating")
    - `num` (number, optional): Number of reviews to return (max 20)
  - Returns:
    - Detailed review text
    - Rating and date information
    - Reviewer profiles and statistics
    - Likes and user engagement data

- **gps_coordinates**
  - Get the current location coordinates
  - Inputs:
    - `fallbackToIP` (boolean, optional): Whether to use IP-based geolocation if precise GPS is unavailable (default: true)
  - Returns:
    - Latitude and longitude
    - Accuracy information
    - Links to view the location on map services

- **firecrawl_scrape**
  - Scrape and extract content from any web page
  - Inputs:
    - `url` (string): The URL of the page to scrape
    - `formats` (array, optional): Output formats (default ["markdown"])

## Configuration

### Getting API Keys
1. For Serper: Sign up for a [Serper.dev account](https://serper.dev)
2. For FireCrawl: Sign up for a [FireCrawl account](https://firecrawl.dev)
3. Generate your API keys from your account dashboards

### Usage with Claude Desktop
Add this to your `claude_desktop_config.json`:

### Docker

```json
{
  "mcpServers": {
    "serper": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SERPER_API_KEY",
        "-e",
        "FIRECRAWL_API_KEY",
        "mcp/hs-search"
      ],
      "env": {
        "SERPER_API_KEY": "YOUR_SERPER_API_KEY_HERE",
        "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_API_KEY_HERE"
      }
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "serper": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-serper"
      ],
      "env": {
        "SERPER_API_KEY": "YOUR_SERPER_API_KEY_HERE",
        "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_API_KEY_HERE"
      }
    }
  }
}
```

## Build and Run

### Docker Build:

```bash
docker build -t mcp/hs-search:latest .
```

### Docker Run:

```bash
docker run -i --rm \
  -e SERPER_API_KEY="your-serper-api-key-here" \
  -e FIRECRAWL_API_KEY="your-firecrawl-api-key-here" \
  mcp/hs-search
```

### Local Development:

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run server
SERPER_API_KEY="your-serper-api-key-here" FIRECRAWL_API_KEY="your-firecrawl-api-key-here" npm start
```

## Example Usage

Here are some examples of how to use the tools in Claude:

1. **Web search:**
   ```
   Can you search for "climate change solutions" and summarize the results?
   ```

2. **News search:**
   ```
   Find me the latest news about "artificial intelligence" in the United States.
   ```

3. **Image search:**
   ```
   Can you find images of "Mars rover Perseverance" and describe what you see?
   ```

4. **Video search:**
   ```
   Search for videos about "how to make sourdough bread" and summarize the top results.
   ```

5. **Maps search:**
   ```
   Search for "coffee shops" near me and tell me which ones have the highest ratings.
   ```

6. **Reviews search:**
   ```
   Search for "Apple Store" and then get all the reviews for the highest-rated location.
   ```

7. **Location+Maps integration:**
   ```
   What's my current location? Now find Italian restaurants within 2 miles of me.
   ```

8. **Maps+Reviews integration:**
   ```
   Find the top-rated "pizza places" near me and show me their most recent reviews.
   ```

9. **Get location:**
   ```
   What is my current location? Can you show the coordinates on a map?
   ```

10. **Web scraping:**
    ```
    Search for documentation on TypeScript interfaces, then scrape and explain the content from one of the result pages.
    ```

## License

This MCP server is licensed under the MIT License. You are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.
