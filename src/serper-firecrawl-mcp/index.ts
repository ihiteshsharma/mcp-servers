#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const SERPER_SEARCH_TOOL: Tool = {
  name: "serper_web_search",
  description:
    "Performs a web search using the Serper.dev API, ideal for general queries, news, articles, and online content. " +
    "Use this for broad information gathering, recent events, or when you need diverse web sources. " +
    "Supports location-based search and language/region customization. " +
    "Maximum 20 results per request. ",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query to perform"
      },
      location: {
        type: "string",
        description: "Optional location context for search (e.g., 'United States', 'India')",
        default: ""
      },
      gl: {
        type: "string",
        description: "Google country code (e.g., 'us', 'in', 'uk')",
        default: "us"
      },
      num: {
        type: "number",
        description: "Number of results (1-20, default 10)",
        default: 10
      }
    },
    required: ["query"],
  },
};

const SERPER_NEWS_TOOL: Tool = {
  name: "serper_news_search",
  description:
    "Searches for news articles using the Serper.dev News API. " +
    "Best for recent news articles, press releases, and timely content. " +
    "Returns detailed information including:\n" +
    "- Article titles and snippets\n" +
    "- Source names and publication dates\n" +
    "- Links to articles\n" +
    "Use this when you need up-to-date news information on specific topics.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "News search query"
      },
      location: {
        type: "string",
        description: "Optional location context for news (e.g., 'United States', 'India')",
        default: ""
      },
      gl: {
        type: "string",
        description: "Google country code (e.g., 'us', 'in', 'uk')",
        default: "us"
      },
      num: {
        type: "number",
        description: "Number of results (1-20, default 5)",
        default: 5
      }
    },
    required: ["query"]
  }
};

const SERPER_IMAGE_TOOL: Tool = {
  name: "serper_image_search",
  description:
    "Searches for images using the Serper.dev Images API. " +
    "Ideal for finding visuals, diagrams, photos, logos, and other graphical content. " +
    "Returns detailed information including:\n" +
    "- Image URLs and thumbnails\n" +
    "- Image dimensions\n" +
    "- Source websites\n" +
    "Use this when you need visual content related to a search query.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Image search query"
      },
      gl: {
        type: "string",
        description: "Google country code (e.g., 'us', 'in', 'uk')",
        default: "us"
      },
      num: {
        type: "number",
        description: "Number of results (1-20, default 10)",
        default: 10
      }
    },
    required: ["query"]
  }
};

const SERPER_VIDEO_TOOL: Tool = {
  name: "serper_video_search",
  description:
    "Searches for videos using the Serper.dev Videos API. " +
    "Great for finding video content from platforms like YouTube and other video hosting sites. " +
    "Returns information including:\n" +
    "- Video titles and descriptions\n" +
    "- Source links\n" +
    "- Channel information when available\n" +
    "Use this when you need video content related to a search query.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Video search query"
      },
      gl: {
        type: "string",
        description: "Google country code (e.g., 'us', 'in', 'uk')",
        default: "us"
      },
      num: {
        type: "number",
        description: "Number of results (1-20, default 5)",
        default: 5
      }
    },
    required: ["query"]
  }
};

const SERPER_MAPS_TOOL: Tool = {
  name: "serper_maps_search",
  description:
    "Searches for places, businesses, and points of interest using the Serper.dev Maps API. " +
    "Ideal for finding nearby locations, addresses, business information, and more. " +
    "Returns detailed place information including:\n" +
    "- Business names and addresses\n" +
    "- Geographic coordinates (latitude/longitude)\n" +
    "- Ratings and reviews\n" +
    "- Business types and categories\n" +
    "- Contact information when available\n" +
    "Use this when you need to find specific places or search for places near a location.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query for places, businesses, or points of interest"
      },
      ll: {
        type: "string",
        description: "Location coordinates in format '@latitude,longitude,zoom' (e.g. '@40.6973709,-74.1444871,11z')",
        default: ""
      },
      useCurrentLocation: {
        type: "boolean",
        description: "Whether to use the current location (determined via IP) if no coordinates are provided",
        default: true
      },
      num: {
        type: "number",
        description: "Number of results (1-20, default 5)",
        default: 5
      }
    },
    required: ["query"],
  },
};

const SERPER_REVIEWS_TOOL: Tool = {
  name: "serper_reviews_search",
  description:
    "Retrieves detailed user reviews for a specific place or business from the Serper.dev Reviews API. " +
    "This tool requires identification parameters from a previous maps search result. " +
    "Returns detailed review information including:\n" +
    "- Rating and date\n" +
    "- Review text and likes\n" +
    "- Reviewer information (name, profile)\n" +
    "- Sorting options for different review views\n" +
    "Use this to research user experiences, sentiment, and feedback about places.",
  inputSchema: {
    type: "object",
    properties: {
      placeId: {
        type: "string",
        description: "Google Place ID (obtain from maps search result)",
      },
      cid: {
        type: "string",
        description: "Google CID (Customer ID, obtain from maps search result)",
      },
      fid: {
        type: "string",
        description: "Google FID (Featured ID, obtain from maps search result)",
      },
      sortBy: {
        type: "string",
        description: "How to sort reviews",
        enum: ["mostRelevant", "newest", "highestRating", "lowestRating"],
        default: "mostRelevant"
      },
      num: {
        type: "number",
        description: "Number of reviews to return (1-20, default 5)",
        default: 5
      }
    },
    required: ["placeId"]
  }
};

const GPS_COORDINATES_TOOL: Tool = {
  name: "gps_coordinates",
  description:
    "Gets the current GPS coordinates using browser geolocation or fallback IP-based location services. " +
    "Provides latitude and longitude that can be used for location-aware searches and services. " +
    "No input parameters required - simply returns the current detected location. " +
    "Note: Accuracy may vary depending on the device and available location services.",
  inputSchema: {
    type: "object",
    properties: {
      fallbackToIP: {
        type: "boolean",
        description: "Whether to fall back to IP-based geolocation if precise GPS is not available",
        default: true
      }
    },
    required: []
  },
};

const FIRECRAWL_SCRAPE_TOOL: Tool = {
  name: "firecrawl_scrape",
  description:
    "Scrapes web pages using the FireCrawl API to extract content in a structured format. " +
    "Ideal for retrieving the full content of articles, documentation, or any web page found in search results. " +
    "Returns content in markdown format for easy readability. " +
    "Use this tool when you need detailed information from a specific website.",
  inputSchema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The URL of the page to scrape"
      },
      formats: {
        type: "array",
        items: {
          type: "string",
          enum: ["markdown", "html", "text"]
        },
        description: "Output formats (default is markdown)",
        default: ["markdown"]
      }
    },
    required: ["url"],
  },
};

// Server implementation
const server = new Server(
  {
    name: "serper-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Check for API keys
const SERPER_API_KEY = process.env.SERPER_API_KEY!;
if (!SERPER_API_KEY) {
  console.error("Error: SERPER_API_KEY environment variable is required");
  process.exit(1);
}

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY!;
if (!FIRECRAWL_API_KEY) {
  console.error("Warning: FIRECRAWL_API_KEY environment variable is not set. The firecrawl_scrape tool will not be available.");
}

// Simple rate limiting
const RATE_LIMIT = {
  perSecond: 5,
  perDay: 2500
};

let requestCount = {
  second: 0,
  day: 0,
  lastReset: Date.now(),
  lastDayReset: new Date().setHours(0, 0, 0, 0)
};

function checkRateLimit() {
  const now = Date.now();
  
  // Reset second counter
  if (now - requestCount.lastReset > 1000) {
    requestCount.second = 0;
    requestCount.lastReset = now;
  }
  
  // Reset daily counter
  const todayStart = new Date().setHours(0, 0, 0, 0);
  if (todayStart > requestCount.lastDayReset) {
    requestCount.day = 0;
    requestCount.lastDayReset = todayStart;
  }
  
  if (requestCount.second >= RATE_LIMIT.perSecond ||
      requestCount.day >= RATE_LIMIT.perDay) {
    throw new Error('Rate limit exceeded');
  }
  
  requestCount.second++;
  requestCount.day++;
}

interface SerperWebResult {
  searchParameters?: {
    q?: string;
    gl?: string;
    hl?: string;
  };
  organic?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
    position?: number;
    sitelinks?: Array<{
      title?: string;
      link?: string;
    }>;
  }>;
  knowledgeGraph?: {
    title?: string;
    type?: string;
    description?: string;
    attributes?: Record<string, string>;
    imageUrl?: string;
  };
  answerBox?: {
    title?: string;
    answer?: string;
    snippet?: string;
  };
  relatedSearches?: Array<{
    query?: string;
  }>;
  peopleAlsoAsk?: Array<{
    question?: string;
    answer?: string;
    title?: string;
    link?: string;
  }>;
}

interface SerperNewsResult {
  news?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
    date?: string;
    source?: string;
    imageUrl?: string;
  }>;
}

interface SerperImageResult {
  searchParameters?: {
    q?: string;
    type?: string;
    engine?: string;
    num?: number;
  };
  images?: Array<{
    title?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    thumbnailUrl?: string;
    thumbnailWidth?: number;
    thumbnailHeight?: number;
    source?: string;
    domain?: string;
    link?: string;
    googleUrl?: string;
    position?: number;
  }>;
  credits?: number;
}

interface SerperVideoResult {
  searchParameters?: {
    q?: string;
    type?: string;
    engine?: string;
    num?: number;
  };
  videos?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
    position?: number;
    channel?: string;
    length?: string;
    date?: string;
    views?: string;
    thumbnails?: Array<{
      url?: string;
      width?: number;
      height?: number;
    }>;
  }>;
  credits?: number;
}

interface SerperMapsResult {
  ll?: string;
  places?: Array<{
    position?: number;
    title?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    ratingCount?: number;
    type?: string;
    types?: string[];
    website?: string;
    phone?: string;
    hours?: string[];
    thumbnailUrl?: string;
    cid?: string;
    fid?: string;
    placeId?: string;
  }>;
  credits?: number;
}

interface SerperReviewsResult {
  reviews?: Array<{
    rating?: number;
    date?: string;
    isoDate?: string;
    snippet?: string;
    likes?: number | null;
    user?: {
      name?: string;
      thumbnail?: string;
      link?: string;
      reviews?: number;
      photos?: number;
    };
    id?: string;
  }>;
  credits?: number;
}

interface FirecrawlResult {
  url: string;
  status: number;
  title?: string;
  markdown?: string;
  html?: string;
  text?: string;
  error?: string;
}

interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
  provider: string; // 'gps', 'ip', or 'error'
  timestamp: number;
  error?: string;
}

function isSerperWebSearchArgs(args: unknown): args is { query: string; location?: string; gl?: string; num?: number } {
  return (
    typeof args === "object" &&
    args !== null &&
    "query" in args &&
    typeof (args as { query: string }).query === "string"
  );
}

function isSerperNewsSearchArgs(args: unknown): args is { query: string; location?: string; gl?: string; num?: number } {
  return (
    typeof args === "object" &&
    args !== null &&
    "query" in args &&
    typeof (args as { query: string }).query === "string"
  );
}

function isSerperImageSearchArgs(args: unknown): args is { query: string; gl?: string; num?: number } {
  return (
    typeof args === "object" &&
    args !== null &&
    "query" in args &&
    typeof (args as { query: string }).query === "string"
  );
}

function isSerperVideoSearchArgs(args: unknown): args is { query: string; gl?: string; num?: number } {
  return (
    typeof args === "object" &&
    args !== null &&
    "query" in args &&
    typeof (args as { query: string }).query === "string"
  );
}

function isSerperMapsSearchArgs(args: unknown): args is { query: string; ll?: string; useCurrentLocation?: boolean; num?: number } {
  return (
    typeof args === "object" &&
    args !== null &&
    "query" in args &&
    typeof (args as { query: string }).query === "string"
  );
}

function isSerperReviewsSearchArgs(
  args: unknown
): args is {
  placeId: string;
  cid?: string;
  fid?: string;
  sortBy?: "mostRelevant" | "newest" | "highestRating" | "lowestRating";
  num?: number;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "placeId" in args &&
    typeof (args as { placeId: string }).placeId === "string"
  );
}

function isFirecrawlScrapeArgs(args: unknown): args is { url: string; formats?: string[] } {
  return (
    typeof args === "object" &&
    args !== null &&
    "url" in args &&
    typeof (args as { url: string }).url === "string"
  );
}

async function performWebSearch(query: string, location: string = "", gl: string = "us", num: number = 10) {
  checkRateLimit();
  
  const params: {
    q: string;
    gl: string;
    num: number;
    location?: string;
  } = {
    q: query,
    gl: gl,
    num: Math.min(num, 20) // API limit
  };
  
  // Add location if provided
  if (location) {
    params.location = location;
  }

  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as SerperWebResult;
  return formatWebResults(data);
}

async function performNewsSearch(query: string, location: string = "", gl: string = "us", num: number = 5) {
  checkRateLimit();
  
  const params: {
    q: string;
    gl: string;
    num: number;
    type: string;
    location?: string;
  } = {
    q: query,
    gl: gl,
    num: Math.min(num, 20), // API limit
    type: "news"
  };
  
  // Add location if provided
  if (location) {
    params.location = location;
  }

  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as SerperNewsResult;
  return formatNewsResults(data);
}

async function performImageSearch(query: string, gl: string = "us", num: number = 10) {
  checkRateLimit();
  
  const params = {
    q: query,
    gl: gl,
    num: Math.min(num, 20) // API limit
  };

  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as SerperImageResult;
  return formatImageResults(data);
}

async function performVideoSearch(query: string, gl: string = "us", num: number = 5) {
  checkRateLimit();
  
  const params = {
    q: query,
    gl: gl,
    num: Math.min(num, 20) // API limit
  };

  const response = await fetch('https://google.serper.dev/videos', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as SerperVideoResult;
  return formatVideoResults(data);
}

async function performMapsSearch(query: string, ll: string = "", useCurrentLocation: boolean = true, num: number = 5) {
  checkRateLimit();
  
  // If no coordinates provided but useCurrentLocation is true, try to get current location
  let locationParam = ll;
  if (!locationParam && useCurrentLocation) {
    try {
      const geoResult = await getGPSCoordinates(true);
      if (geoResult.provider !== 'error') {
        locationParam = `@${geoResult.latitude},${geoResult.longitude},14z`;
      }
    } catch (error) {
      // Silent fail - we'll just search without location context
    }
  }
  
  const params: {
    q: string;
    ll?: string;
    num: number;
  } = {
    q: query,
    num: Math.min(num, 20) // API limit
  };
  
  // Add location if available
  if (locationParam) {
    params.ll = locationParam;
  }

  const response = await fetch('https://google.serper.dev/maps', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as SerperMapsResult;
  return formatMapsResults(data);
}

async function performWebScraping(url: string, formats: string[] = ["markdown"]) {
  if (!FIRECRAWL_API_KEY) {
    throw new Error("FireCrawl API key not provided. Set the FIRECRAWL_API_KEY environment variable.");
  }

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      formats
    })
  });

  if (!response.ok) {
    throw new Error(`FireCrawl API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as FirecrawlResult;
  
  if (data.error) {
    throw new Error(`FireCrawl scraping error: ${data.error}`);
  }
  
  return formatScrapingResults(data);
}

async function getGPSCoordinates(fallbackToIP: boolean = true): Promise<GeolocationResult> {
  try {
    // Try IP-based geolocation from ipapi.co (free service)
    if (fallbackToIP) {
      const response = await fetch('https://ipapi.co/json/');
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.latitude && data.longitude) {
          return {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: 5000, // IP geolocation is typically accurate to city level (few km)
            provider: 'ip',
            timestamp: Date.now()
          };
        }
      }
    }

    // If we reach here, both attempts failed
    return {
      latitude: 0,
      longitude: 0,
      provider: 'error',
      timestamp: Date.now(),
      error: 'Could not determine location'
    };
  } catch (error) {
    return {
      latitude: 0,
      longitude: 0,
      provider: 'error',
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function formatWebResults(data: SerperWebResult): string {
  let result = '';
  
  // Format answer box if available
  if (data.answerBox) {
    result += `FEATURED ANSWER:\n`;
    if (data.answerBox.title) result += `Title: ${data.answerBox.title}\n`;
    if (data.answerBox.answer) result += `Answer: ${data.answerBox.answer}\n`;
    if (data.answerBox.snippet) result += `Description: ${data.answerBox.snippet}\n`;
    result += '\n';
  }
  
  // Format knowledge graph if available
  if (data.knowledgeGraph) {
    result += `KNOWLEDGE GRAPH:\n`;
    if (data.knowledgeGraph.title) result += `Title: ${data.knowledgeGraph.title}\n`;
    if (data.knowledgeGraph.type) result += `Type: ${data.knowledgeGraph.type}\n`;
    if (data.knowledgeGraph.description) result += `Description: ${data.knowledgeGraph.description}\n`;
    
    // Format attributes
    if (data.knowledgeGraph.attributes && Object.keys(data.knowledgeGraph.attributes).length > 0) {
      result += `Attributes:\n`;
      for (const [key, value] of Object.entries(data.knowledgeGraph.attributes)) {
        result += `  ${key}: ${value}\n`;
      }
    }
    result += '\n';
  }
  
  // Format organic results
  if (data.organic && data.organic.length > 0) {
    result += `SEARCH RESULTS:\n\n`;
    result += data.organic.map(result => {
      let str = `Title: ${result.title || 'N/A'}\n`;
      str += `URL: ${result.link || 'N/A'}\n`;
      str += `Description: ${result.snippet || 'N/A'}\n`;
      
      // Add sitelinks if available
      if (result.sitelinks && result.sitelinks.length > 0) {
        str += `Related Links:\n`;
        result.sitelinks.forEach(sitelink => {
          str += `  - ${sitelink.title || 'N/A'}: ${sitelink.link || 'N/A'}\n`;
        });
      }
      
      return str;
    }).join('\n---\n');
  }
  
  // Format "People Also Ask" section
  if (data.peopleAlsoAsk && data.peopleAlsoAsk.length > 0) {
    result += `\n\nPEOPLE ALSO ASK:\n\n`;
    result += data.peopleAlsoAsk.map(item => {
      let str = `Q: ${item.question || 'N/A'}\n`;
      str += `A: ${item.answer || 'N/A'}\n`;
      if (item.title && item.link) {
        str += `Source: ${item.title} (${item.link})\n`;
      }
      return str;
    }).join('\n---\n');
  }
  
  // Format related searches
  if (data.relatedSearches && data.relatedSearches.length > 0) {
    result += `\n\nRELATED SEARCHES:\n`;
    result += data.relatedSearches.map(item => `- ${item.query || 'N/A'}`).join('\n');
  }
  
  return result || 'No results found';
}

function formatNewsResults(data: SerperNewsResult): string {
  if (!data.news || data.news.length === 0) {
    return 'No news results found';
  }
  
  return data.news.map(article => {
    let str = `Title: ${article.title || 'N/A'}\n`;
    str += `Source: ${article.source || 'N/A'}`;
    if (article.date) str += ` - ${article.date}`;
    str += '\n';
    str += `URL: ${article.link || 'N/A'}\n`;
    str += `Summary: ${article.snippet || 'N/A'}\n`;
    
    return str;
  }).join('\n---\n');
}

function formatImageResults(data: SerperImageResult): string {
  if (!data.images || data.images.length === 0) {
    return 'No image results found';
  }
  
  let result = `IMAGE SEARCH RESULTS:\n\n`;
  
  result += data.images.map(image => {
    let str = `Title: ${image.title || 'N/A'}\n`;
    str += `Source: ${image.source || 'N/A'} (${image.domain || 'N/A'})\n`;
    str += `Image URL: ${image.imageUrl || 'N/A'}\n`;
    str += `Thumbnail URL: ${image.thumbnailUrl || 'N/A'}\n`;
    str += `Dimensions: ${image.imageWidth || 'N/A'} x ${image.imageHeight || 'N/A'}\n`;
    str += `Original Page: ${image.link || 'N/A'}\n`;
    
    return str;
  }).join('\n---\n');
  
  return result;
}

function formatVideoResults(data: SerperVideoResult): string {
  if (!data.videos || data.videos.length === 0) {
    return 'No video results found';
  }
  
  let result = `VIDEO SEARCH RESULTS:\n\n`;
  
  result += data.videos.map(video => {
    let str = `Title: ${video.title || 'N/A'}\n`;
    str += `URL: ${video.link || 'N/A'}\n`;
    str += `Description: ${video.snippet || 'N/A'}\n`;
    
    if (video.channel) str += `Channel: ${video.channel}\n`;
    if (video.length) str += `Length: ${video.length}\n`;
    if (video.date) str += `Date: ${video.date}\n`;
    if (video.views) str += `Views: ${video.views}\n`;
    
    if (video.thumbnails && video.thumbnails.length > 0) {
      str += `Thumbnail: ${video.thumbnails[0].url || 'N/A'}\n`;
    }
    
    return str;
  }).join('\n---\n');
  
  return result;
}

function formatScrapingResults(data: FirecrawlResult): string {
  let result = '';
  
  result += `SCRAPED CONTENT FROM: ${data.url}\n`;
  if (data.title) {
    result += `Page Title: ${data.title}\n\n`;
  }
  
  // Prefer markdown format if available
  if (data.markdown) {
    result += `${data.markdown}`;
  } else if (data.text) {
    result += `${data.text}`;
  } else if (data.html) {
    result += `HTML content available but not displayed due to format`;
  } else {
    result += `No content was extracted from the page.`;
  }
  
  return result;
}

function formatMapsResults(data: SerperMapsResult): string {
  if (!data.places || data.places.length === 0) {
    return 'No place results found';
  }
  
  let result = `LOCATION SEARCH RESULTS:\n\n`;
  
  if (data.ll) {
    result += `Search area: ${data.ll}\n\n`;
  }
  
  result += data.places.map(place => {
    let str = `Name: ${place.title || 'N/A'}\n`;
    str += `Address: ${place.address || 'N/A'}\n`;
    
    if (place.latitude !== undefined && place.longitude !== undefined) {
      str += `Coordinates: ${place.latitude}, ${place.longitude}\n`;
    }
    
    if (place.rating !== undefined) {
      str += `Rating: ${place.rating} stars`;
      if (place.ratingCount !== undefined) {
        str += ` (${place.ratingCount} reviews)`;
      }
      str += '\n';
    }
    
    if (place.type) {
      str += `Primary Category: ${place.type}\n`;
    }
    
    if (place.types && place.types.length > 0) {
      str += `Categories: ${place.types.join(', ')}\n`;
    }
    
    if (place.phone) {
      str += `Phone: ${place.phone}\n`;
    }
    
    if (place.website) {
      str += `Website: ${place.website}\n`;
    }
    
    if (place.hours && place.hours.length > 0) {
      str += `Hours: ${place.hours.join('; ')}\n`;
    }
    
    if (place.thumbnailUrl) {
      str += `Image: ${place.thumbnailUrl}\n`;
    }
    
    // Add Google Maps link
    if (place.latitude !== undefined && place.longitude !== undefined) {
      str += `View on Maps: https://www.google.com/maps?q=${place.latitude},${place.longitude}\n`;
    }
    
    return str;
  }).join('\n---\n');
  
  return result;
}

function formatGeolocationResults(data: GeolocationResult): string {
  if (data.provider === 'error') {
    return `Error obtaining location: ${data.error || 'Unknown error'}`;
  }
  
  let result = 'CURRENT LOCATION:\n\n';
  result += `Latitude: ${data.latitude.toFixed(6)}\n`;
  result += `Longitude: ${data.longitude.toFixed(6)}\n`;
  
  if (data.accuracy) {
    result += `Accuracy: ±${Math.round(data.accuracy)} meters\n`;
  }
  
  result += `Provider: ${data.provider === 'gps' ? 'GPS' : 'IP-based geolocation'}\n`;
  result += `Timestamp: ${new Date(data.timestamp).toISOString()}\n`;
  
  // Add links to maps services
  result += '\nView on Maps:\n';
  result += `Google Maps: https://www.google.com/maps?q=${data.latitude},${data.longitude}\n`;
  result += `OpenStreetMap: https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}&zoom=15\n`;
  
  return result;
}

// Add function to detect if GPS tool is supported
function isGPSCoordsArgs(args: unknown): args is { fallbackToIP?: boolean } {
  return (
    args === undefined ||
    args === null ||
    (typeof args === "object" &&
     (!("fallbackToIP" in args) ||
      typeof (args as { fallbackToIP?: boolean }).fallbackToIP === "boolean"))
  );
}

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: FIRECRAWL_API_KEY 
    ? [SERPER_SEARCH_TOOL, SERPER_NEWS_TOOL, SERPER_IMAGE_TOOL, SERPER_VIDEO_TOOL, SERPER_MAPS_TOOL, SERPER_REVIEWS_TOOL, GPS_COORDINATES_TOOL, FIRECRAWL_SCRAPE_TOOL]
    : [SERPER_SEARCH_TOOL, SERPER_NEWS_TOOL, SERPER_IMAGE_TOOL, SERPER_VIDEO_TOOL, SERPER_MAPS_TOOL, SERPER_REVIEWS_TOOL, GPS_COORDINATES_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name !== "gps_coordinates" && !args) {
      throw new Error("No arguments provided");
    }

    switch (name) {
      case "serper_web_search": {
        if (!isSerperWebSearchArgs(args)) {
          throw new Error("Invalid arguments for serper_web_search");
        }
        const { query, location = "", gl = "us", num = 10 } = args;
        const results = await performWebSearch(query, location, gl, num);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      case "serper_news_search": {
        if (!isSerperNewsSearchArgs(args)) {
          throw new Error("Invalid arguments for serper_news_search");
        }
        const { query, location = "", gl = "us", num = 5 } = args;
        const results = await performNewsSearch(query, location, gl, num);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      case "serper_image_search": {
        if (!isSerperImageSearchArgs(args)) {
          throw new Error("Invalid arguments for serper_image_search");
        }
        const { query, gl = "us", num = 10 } = args;
        const results = await performImageSearch(query, gl, num);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      case "serper_video_search": {
        if (!isSerperVideoSearchArgs(args)) {
          throw new Error("Invalid arguments for serper_video_search");
        }
        const { query, gl = "us", num = 5 } = args;
        const results = await performVideoSearch(query, gl, num);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      case "serper_maps_search": {
        if (!isSerperMapsSearchArgs(args)) {
          throw new Error("Invalid arguments for serper_maps_search");
        }
        const { query, ll = "", useCurrentLocation = true, num = 5 } = args;
        const results = await performMapsSearch(query, ll, useCurrentLocation, num);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      case "serper_reviews_search": {
        if (!isSerperReviewsSearchArgs(args)) {
          throw new Error("Invalid arguments for serper_reviews_search");
        }
        const { placeId, cid = "", fid = "", sortBy = "mostRelevant", num = 5 } = args;
        const results = await performReviewsSearch(placeId, cid, fid, sortBy, num);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      case "gps_coordinates": {
        if (!isGPSCoordsArgs(args)) {
          throw new Error("Invalid arguments for gps_coordinates");
        }
        const { fallbackToIP = true } = args || {};
        const results = await getGPSCoordinates(fallbackToIP);
        const formattedResults = formatGeolocationResults(results);
        return {
          content: [{ type: "text", text: formattedResults }],
          isError: results.provider === 'error',
        };
      }

      case "firecrawl_scrape": {
        if (!isFirecrawlScrapeArgs(args)) {
          throw new Error("Invalid arguments for firecrawl_scrape");
        }
        const { url, formats = ["markdown"] } = args;
        const results = await performWebScraping(url, formats);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Serper MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});

async function performReviewsSearch(
  placeId: string,
  cid: string = "",
  fid: string = "",
  sortBy: "mostRelevant" | "newest" | "highestRating" | "lowestRating" = "mostRelevant",
  num: number = 5
) {
  checkRateLimit();
  
  const params: {
    placeId: string;
    cid?: string;
    fid?: string;
    sortBy: string;
    num?: number;
  } = {
    placeId,
    sortBy
  };
  
  // Only add optional params if they exist
  if (cid) params.cid = cid;
  if (fid) params.fid = fid;
  if (num) params.num = Math.min(num, 20); // API limit
  
  const response = await fetch('https://google.serper.dev/reviews', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const data = await response.json() as SerperReviewsResult;
  return formatReviewsResults(data);
}

function formatReviewsResults(data: SerperReviewsResult): string {
  if (!data.reviews || data.reviews.length === 0) {
    return 'No reviews found for this place';
  }
  
  let result = `PLACE REVIEWS:\n\n`;
  
  result += data.reviews.map(review => {
    let str = '';
    
    // Rating and date
    if (review.rating !== undefined) {
      str += `Rating: ${review.rating} stars\n`;
    }
    
    if (review.date) {
      if (review.isoDate) {
        str += `Date: ${new Date(review.isoDate).toLocaleDateString()} (${review.date})\n`;
      } else {
        str += `Date: ${review.date}\n`;
      }
    }
    
    // User information
    if (review.user) {
      str += `Reviewer: ${review.user.name || 'Anonymous'}\n`;
      
      if (review.user.reviews !== undefined) {
        str += `Reviewer Stats: ${review.user.reviews} reviews`;
        if (review.user.photos !== undefined) {
          str += `, ${review.user.photos} photos`;
        }
        str += '\n';
      }
      
      if (review.likes !== null && review.likes !== undefined) {
        str += `Likes: ${review.likes}\n`;
      }
    }
    
    // Review text
    if (review.snippet) {
      str += `Review:\n${review.snippet}\n`;
    }
    
    // User profile link if available
    if (review.user?.link) {
      str += `Profile: ${review.user.link}\n`;
    }
    
    return str;
  }).join('\n---\n');
  
  return result;
}
