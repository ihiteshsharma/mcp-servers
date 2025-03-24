#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB tools definition
const MONGODB_QUERY_TOOL: Tool = {
  name: "mongodb_query",
  description:
    "Performs a query operation on a MongoDB collection. " +
    "Supports filtering, projection, sorting, and limiting results. " +
    "Use this tool to retrieve documents from a MongoDB collection. " +
    "Maximum 100 results per request.",
  inputSchema: {
    type: "object",
    properties: {
      database: {
        type: "string",
        description: "MongoDB database name"
      },
      collection: {
        type: "string",
        description: "MongoDB collection name"
      },
      filter: {
        type: "object",
        description: "Query filter in MongoDB format (e.g. { \"field\": \"value\" })",
        default: {}
      },
      projection: {
        type: "object",
        description: "Fields to include/exclude in MongoDB format (e.g. { \"field\": 1 })",
        default: {}
      },
      sort: {
        type: "object",
        description: "Sort specification in MongoDB format (e.g. { \"field\": 1 } for ascending)",
        default: {}
      },
      limit: {
        type: "number",
        description: "Maximum number of documents to return (1-100)",
        default: 10
      },
      skip: {
        type: "number",
        description: "Number of documents to skip",
        default: 0
      }
    },
    required: ["database", "collection"],
  },
};

const MONGODB_COUNT_TOOL: Tool = {
  name: "mongodb_count",
  description:
    "Counts the number of documents in a MongoDB collection that match a query filter. " +
    "Use this tool to get document counts without retrieving the actual documents.",
  inputSchema: {
    type: "object",
    properties: {
      database: {
        type: "string",
        description: "MongoDB database name"
      },
      collection: {
        type: "string",
        description: "MongoDB collection name"
      },
      filter: {
        type: "object",
        description: "Query filter in MongoDB format (e.g. { \"field\": \"value\" })",
        default: {}
      }
    },
    required: ["database", "collection"],
  },
};

const MONGODB_AGGREGATE_TOOL: Tool = {
  name: "mongodb_aggregate",
  description:
    "Performs an aggregation operation on a MongoDB collection. " +
    "Use this tool for complex data processing, such as grouping, joining multiple collections, " +
    "or performing complex calculations. " +
    "Maximum 100 results per request.",
  inputSchema: {
    type: "object",
    properties: {
      database: {
        type: "string",
        description: "MongoDB database name"
      },
      collection: {
        type: "string",
        description: "MongoDB collection name"
      },
      pipeline: {
        type: "array",
        description: "Aggregation pipeline stages in MongoDB format",
        items: {
          type: "object"
        }
      },
      limit: {
        type: "number",
        description: "Maximum number of documents to return (1-100)",
        default: 10
      }
    },
    required: ["database", "collection", "pipeline"],
  },
};

const MONGODB_DISTINCT_TOOL: Tool = {
  name: "mongodb_distinct",
  description:
    "Finds the distinct values for a specified field across a MongoDB collection. " +
    "Use this tool to identify unique values within a field. " +
    "Can be filtered to only consider documents matching specific criteria.",
  inputSchema: {
    type: "object",
    properties: {
      database: {
        type: "string",
        description: "MongoDB database name"
      },
      collection: {
        type: "string",
        description: "MongoDB collection name"
      },
      field: {
        type: "string",
        description: "Field for which to return distinct values"
      },
      filter: {
        type: "object",
        description: "Query filter in MongoDB format (e.g. { \"field\": \"value\" })",
        default: {}
      }
    },
    required: ["database", "collection", "field"],
  },
};

const MONGODB_LIST_DATABASES_TOOL: Tool = {
  name: "mongodb_list_databases",
  description:
    "Lists all available databases in the MongoDB server. " +
    "Use this tool to discover what databases are available.",
  inputSchema: {
    type: "object",
    properties: {
      filter: {
        type: "object",
        description: "Optional filter for the returned databases",
        default: {}
      }
    },
    required: [],
  },
};

const MONGODB_LIST_COLLECTIONS_TOOL: Tool = {
  name: "mongodb_list_collections",
  description:
    "Lists all collections in a specified MongoDB database. " +
    "Use this tool to discover what collections are available in a database.",
  inputSchema: {
    type: "object",
    properties: {
      database: {
        type: "string",
        description: "MongoDB database name"
      },
      filter: {
        type: "object",
        description: "Optional filter for the returned collections",
        default: {}
      }
    },
    required: ["database"],
  },
};

// Server implementation
const server = new Server(
  {
    name: "mongodb-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Check for MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is required");
  process.exit(1);
}

// Simple rate limiting
const RATE_LIMIT = {
  perSecond: 5,
  perDay: 1000
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

// MongoDB client
let client: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}

// Type definitions
interface MongoDBQueryArgs {
  database: string;
  collection: string;
  filter?: Record<string, any>;
  projection?: Record<string, any>;
  sort?: Record<string, any>;
  limit?: number;
  skip?: number;
}

interface MongoDBCountArgs {
  database: string;
  collection: string;
  filter?: Record<string, any>;
}

interface MongoDBDistinctArgs {
  database: string;
  collection: string;
  field: string;
  filter?: Record<string, any>;
}

interface MongoDBListDatabasesArgs {
  filter?: Record<string, any>;
}

interface MongoDBListCollectionsArgs {
  database: string;
  filter?: Record<string, any>;
}

interface MongoDBQueryResult {
  count: number;
  documents: any[];
}

interface MongoDBCountResult {
  count: number;
}

interface MongoDBDistinctResult {
  values: any[];
}

interface MongoDBListDatabasesResult {
  databases: string[];
}

interface MongoDBListCollectionsResult {
  collections: string[];
}

interface MongoDBAggregateArgs {
  database: string;
  collection: string;
  pipeline: any[];
  limit?: number;
}

interface MongoDBAggregateResult {
  count: number;
  results: any[];
}

// Type guards
function isMongoDBQueryArgs(args: unknown): args is MongoDBQueryArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "database" in args &&
    typeof (args as MongoDBQueryArgs).database === "string" &&
    "collection" in args &&
    typeof (args as MongoDBQueryArgs).collection === "string"
  );
}

function isMongoDBCountArgs(args: unknown): args is MongoDBCountArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "database" in args &&
    typeof (args as MongoDBCountArgs).database === "string" &&
    "collection" in args &&
    typeof (args as MongoDBCountArgs).collection === "string"
  );
}

function isMongoDBDistinctArgs(args: unknown): args is MongoDBDistinctArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "database" in args &&
    typeof (args as MongoDBDistinctArgs).database === "string" &&
    "collection" in args &&
    typeof (args as MongoDBDistinctArgs).collection === "string" &&
    "field" in args &&
    typeof (args as MongoDBDistinctArgs).field === "string"
  );
}

function isMongoDBListDatabasesArgs(args: unknown): args is MongoDBListDatabasesArgs {
  return (
    !args ||
    (typeof args === "object" &&
    args !== null &&
    (!("filter" in args) || typeof (args as MongoDBListDatabasesArgs).filter === "object"))
  );
}

function isMongoDBListCollectionsArgs(args: unknown): args is MongoDBListCollectionsArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "database" in args &&
    typeof (args as MongoDBListCollectionsArgs).database === "string"
  );
}

function isMongoDBAggregateArgs(args: unknown): args is MongoDBAggregateArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "database" in args &&
    typeof (args as MongoDBAggregateArgs).database === "string" &&
    "collection" in args &&
    typeof (args as MongoDBAggregateArgs).collection === "string" &&
    "pipeline" in args &&
    Array.isArray((args as MongoDBAggregateArgs).pipeline)
  );
}

// MongoDB operations
async function performQuery(
  database: string,
  collection: string,
  filter: Record<string, any> = {},
  projection: Record<string, any> = {},
  sort: Record<string, any> = {},
  limit: number = 10,
  skip: number = 0
): Promise<MongoDBQueryResult> {
  checkRateLimit();
  
  // Process filter to convert string ObjectIds to ObjectId instances
  filter = processObjectIds(filter);
  
  const client = await getMongoClient();
  const db = client.db(database);
  const coll = db.collection(collection);
  
  // Apply query parameters
  const effectiveLimit = Math.min(limit, 100); // Cap at 100
  
  // Execute query
  const cursor = coll.find(filter)
    .project(projection)
    .sort(sort)
    .skip(skip)
    .limit(effectiveLimit);
  
  const documents = await cursor.toArray();
  
  return {
    count: documents.length,
    documents
  };
}

async function performCount(
  database: string,
  collection: string,
  filter: Record<string, any> = {}
): Promise<MongoDBCountResult> {
  checkRateLimit();
  
  // Process filter to convert string ObjectIds to ObjectId instances
  filter = processObjectIds(filter);
  
  const client = await getMongoClient();
  const db = client.db(database);
  const coll = db.collection(collection);
  
  // Execute count
  const count = await coll.countDocuments(filter);
  
  return { count };
}

async function performDistinct(
  database: string,
  collection: string,
  field: string,
  filter: Record<string, any> = {}
): Promise<MongoDBDistinctResult> {
  checkRateLimit();
  
  // Process filter to convert string ObjectIds to ObjectId instances
  filter = processObjectIds(filter);
  
  const client = await getMongoClient();
  const db = client.db(database);
  const coll = db.collection(collection);
  
  // Execute distinct
  const values = await coll.distinct(field, filter);
  
  return { values };
}

async function listDatabases(
  filter: Record<string, any> = {}
): Promise<MongoDBListDatabasesResult> {
  checkRateLimit();
  
  const client = await getMongoClient();
  
  // List databases
  const result = await client.db().admin().listDatabases(filter);
  const databases = result.databases.map(db => db.name);
  
  return { databases };
}

async function listCollections(
  database: string,
  filter: Record<string, any> = {}
): Promise<MongoDBListCollectionsResult> {
  checkRateLimit();
  
  const client = await getMongoClient();
  const db = client.db(database);
  
  // List collections
  const collections = await db.listCollections(filter).toArray();
  const collectionNames = collections.map(coll => coll.name);
  
  return { collections: collectionNames };
}

async function performAggregate(
  database: string,
  collection: string,
  pipeline: any[],
  limit: number = 10
): Promise<MongoDBAggregateResult> {
  checkRateLimit();
  
  // Process pipeline to convert string ObjectIds to ObjectId instances
  pipeline = processPipelineObjectIds(pipeline);
  
  const client = await getMongoClient();
  const db = client.db(database);
  const coll = db.collection(collection);
  
  // Apply limit if provided
  const effectiveLimit = Math.min(limit, 100); // Cap at 100
  if (limit) {
    pipeline.push({ $limit: effectiveLimit });
  }
  
  // Execute aggregation
  const results = await coll.aggregate(pipeline).toArray();
  
  return {
    count: results.length,
    results
  };
}

// Helper function to process ObjectIds in filters
function processObjectIds(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (key === '_id' && typeof obj[key] === 'string' && /^[0-9a-fA-F]{24}$/.test(obj[key])) {
      result[key] = new ObjectId(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = processObjectIds(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  
  return result;
}

// Helper function to process ObjectIds in aggregation pipeline
function processPipelineObjectIds(pipeline: any[]): any[] {
  return pipeline.map(stage => {
    const result: Record<string, any> = {};
    
    for (const key in stage) {
      if (typeof stage[key] === 'object' && stage[key] !== null) {
        result[key] = processObjectIds(stage[key]);
      } else {
        result[key] = stage[key];
      }
    }
    
    return result;
  });
}

// Formatters
function formatQueryResults(data: MongoDBQueryResult): string {
  let result = `QUERY RESULTS:\n\n`;
  result += `Found ${data.count} document(s)\n\n`;
  
  if (data.documents.length === 0) {
    result += 'No documents match the query.';
    return result;
  }
  
  result += data.documents.map((doc, index) => {
    return `Document ${index + 1}:\n${JSON.stringify(doc, null, 2)}`;
  }).join('\n\n');
  
  return result;
}

function formatCountResults(data: MongoDBCountResult): string {
  return `COUNT RESULTS:\n\nFound ${data.count} document(s) matching the query criteria.`;
}

function formatDistinctResults(data: MongoDBDistinctResult): string {
  let result = `DISTINCT VALUES:\n\n`;
  result += `Found ${data.values.length} distinct value(s)\n\n`;
  
  if (data.values.length === 0) {
    result += 'No distinct values found.';
    return result;
  }
  
  result += data.values.map((value, index) => {
    return `Value ${index + 1}: ${JSON.stringify(value)}`;
  }).join('\n');
  
  return result;
}

function formatListDatabasesResults(data: MongoDBListDatabasesResult): string {
  let result = `AVAILABLE DATABASES:\n\n`;
  
  if (data.databases.length === 0) {
    result += 'No databases found.';
    return result;
  }
  
  result += data.databases.join('\n');
  
  return result;
}

function formatListCollectionsResults(data: MongoDBListCollectionsResult): string {
  let result = `COLLECTIONS:\n\n`;
  
  if (data.collections.length === 0) {
    result += 'No collections found in this database.';
    return result;
  }
  
  result += data.collections.join('\n');
  
  return result;
}

function formatAggregateResults(data: MongoDBAggregateResult): string {
  let result = `AGGREGATION RESULTS:\n\n`;
  result += `Found ${data.count} result(s)\n\n`;
  
  if (data.results.length === 0) {
    result += 'No results from the aggregation pipeline.';
    return result;
  }
  
  result += data.results.map((doc, index) => {
    return `Result ${index + 1}:\n${JSON.stringify(doc, null, 2)}`;
  }).join('\n\n');
  
  return result;
}

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    MONGODB_QUERY_TOOL,
    MONGODB_COUNT_TOOL,
    MONGODB_AGGREGATE_TOOL,
    MONGODB_DISTINCT_TOOL,
    MONGODB_LIST_DATABASES_TOOL,
    MONGODB_LIST_COLLECTIONS_TOOL
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args && name !== "mongodb_list_databases") {
      throw new Error("No arguments provided");
    }

    switch (name) {
      case "mongodb_query": {
        if (!isMongoDBQueryArgs(args)) {
          throw new Error("Invalid arguments for mongodb_query");
        }
        const { database, collection, filter = {}, projection = {}, sort = {}, limit = 10, skip = 0 } = args;
        const results = await performQuery(database, collection, filter, projection, sort, limit, skip);
        return {
          content: [{ type: "text", text: formatQueryResults(results) }],
          isError: false,
        };
      }

      case "mongodb_count": {
        if (!isMongoDBCountArgs(args)) {
          throw new Error("Invalid arguments for mongodb_count");
        }
        const { database, collection, filter = {} } = args;
        const results = await performCount(database, collection, filter);
        return {
          content: [{ type: "text", text: formatCountResults(results) }],
          isError: false,
        };
      }

      case "mongodb_distinct": {
        if (!isMongoDBDistinctArgs(args)) {
          throw new Error("Invalid arguments for mongodb_distinct");
        }
        const { database, collection, field, filter = {} } = args;
        const results = await performDistinct(database, collection, field, filter);
        return {
          content: [{ type: "text", text: formatDistinctResults(results) }],
          isError: false,
        };
      }

      case "mongodb_list_databases": {
        if (!isMongoDBListDatabasesArgs(args)) {
          throw new Error("Invalid arguments for mongodb_list_databases");
        }
        const { filter = {} } = args || {};
        const results = await listDatabases(filter);
        return {
          content: [{ type: "text", text: formatListDatabasesResults(results) }],
          isError: false,
        };
      }

      case "mongodb_list_collections": {
        if (!isMongoDBListCollectionsArgs(args)) {
          throw new Error("Invalid arguments for mongodb_list_collections");
        }
        const { database, filter = {} } = args;
        const results = await listCollections(database, filter);
        return {
          content: [{ type: "text", text: formatListCollectionsResults(results) }],
          isError: false,
        };
      }

      case "mongodb_aggregate": {
        if (!isMongoDBAggregateArgs(args)) {
          throw new Error("Invalid arguments for mongodb_aggregate");
        }
        const { database, collection, pipeline, limit = 10 } = args;
        const results = await performAggregate(database, collection, pipeline, limit);
        return {
          content: [{ type: "text", text: formatAggregateResults(results) }],
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

// Graceful shutdown
process.on('SIGINT', async () => {
  console.error('Received SIGINT. Closing MongoDB connection and shutting down...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Received SIGTERM. Closing MongoDB connection and shutting down...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MongoDB MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
