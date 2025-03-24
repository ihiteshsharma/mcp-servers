# MongoDB MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that provides tools for interacting with MongoDB databases. This server enables AI models to query, aggregate, and manage MongoDB data through standardized MCP tools.

## Features

- Query MongoDB collections with filtering, projection, sorting, and pagination
- Count documents matching a query filter
- Perform complex aggregation operations
- Find distinct values in a collection
- List available databases and collections
- Automatic handling of MongoDB ObjectIds
- Rate limiting to prevent abuse

## Installation

```bash
npm install
```

## Environment Variables

The server requires the following environment variables:

- `MONGODB_URI`: The MongoDB connection string (required)

Example:
```
MONGODB_URI="mongodb://username:password@localhost:27017/mydatabase"
```

## Usage

### Starting the Server

Build and start the server:

```bash
npm run build
npm start
```

For development with automatic rebuilding:

```bash
npm run dev
```

### Available Tools

The MongoDB MCP server provides the following tools:

#### 1. `mongodb_query`

Performs a query operation on a MongoDB collection.

Parameters:
- `database` (required): MongoDB database name
- `collection` (required): MongoDB collection name
- `filter`: Query filter in MongoDB format (e.g. `{ "field": "value" }`)
- `projection`: Fields to include/exclude in MongoDB format (e.g. `{ "field": 1 }`)
- `sort`: Sort specification in MongoDB format (e.g. `{ "field": 1 }` for ascending)
- `limit`: Maximum number of documents to return (1-100, default 10)
- `skip`: Number of documents to skip (default 0)

#### 2. `mongodb_count`

Counts the number of documents in a MongoDB collection that match a query filter.

Parameters:
- `database` (required): MongoDB database name
- `collection` (required): MongoDB collection name
- `filter`: Query filter in MongoDB format (e.g. `{ "field": "value" }`)

#### 3. `mongodb_aggregate`

Performs an aggregation operation on a MongoDB collection.

Parameters:
- `database` (required): MongoDB database name
- `collection` (required): MongoDB collection name
- `pipeline` (required): Aggregation pipeline stages in MongoDB format
- `limit`: Maximum number of documents to return (1-100, default 10)

#### 4. `mongodb_distinct`

Finds the distinct values for a specified field across a MongoDB collection.

Parameters:
- `database` (required): MongoDB database name
- `collection` (required): MongoDB collection name
- `field` (required): Field for which to return distinct values
- `filter`: Query filter in MongoDB format (e.g. `{ "field": "value" }`)

#### 5. `mongodb_list_databases`

Lists all available databases in the MongoDB server.

Parameters:
- `filter`: Optional filter for the returned databases

#### 6. `mongodb_list_collections`

Lists all collections in a specified MongoDB database.

Parameters:
- `database` (required): MongoDB database name
- `filter`: Optional filter for the returned collections

## Examples

### Querying Documents

```json
{
  "database": "mydatabase",
  "collection": "users",
  "filter": { "age": { "$gt": 18 } },
  "projection": { "name": 1, "email": 1, "_id": 0 },
  "sort": { "name": 1 },
  "limit": 5
}
```

### Counting Documents

```json
{
  "database": "mydatabase",
  "collection": "orders",
  "filter": { "status": "completed" }
}
```

### Aggregation Example

```json
{
  "database": "mydatabase",
  "collection": "sales",
  "pipeline": [
    { "$match": { "date": { "$gte": "2023-01-01" } } },
    { "$group": { "_id": "$product", "totalSales": { "$sum": "$amount" } } },
    { "$sort": { "totalSales": -1 } }
  ],
  "limit": 10
}
```

### Finding Distinct Values

```json
{
  "database": "mydatabase",
  "collection": "products",
  "field": "category",
  "filter": { "active": true }
}
```

## Docker Deployment

This server includes a Dockerfile for containerized deployment. To build and run:

```bash
docker build -t mongodb-mcp-server .
docker run -e MONGODB_URI="mongodb://username:password@host:27017/mydatabase" mongodb-mcp-server
```

## License

MIT
