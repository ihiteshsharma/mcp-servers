# MCP Servers Collection

This repository contains a collection of [Model Context Protocol (MCP)](https://github.com/anthropics/model-context-protocol) servers, each providing unique functionality to enhance AI assistants like Claude.

## Available Servers

### Serper MCP Server

A comprehensive search and location server that integrates with the Serper API, providing:

- **Web Search**: General queries, knowledge graphs, people also ask, and more
- **News Search**: Articles, press releases, and timely content with source information
- **Image Search**: Photos, diagrams, logos, and other visual content
- **Video Search**: Videos from YouTube and other platforms
- **Maps Search**: Places, businesses, and points of interest with detailed information
- **Reviews Search**: Detailed user reviews and ratings for businesses and places
- **Web Scraping**: Extract and format content from any web page found in search results
- **Location Services**: Get current GPS coordinates for location-aware searches

See the [serper-mcp-server](./serper-mcp-server/README.md) directory for detailed documentation.

## What are MCP Servers?

Model Context Protocol (MCP) servers allow large language models like Claude to interact with external tools, APIs, and data sources. They:

- Enable AI assistants to access real-time information
- Allow for structured data retrieval and specialized functions
- Provide standardized interfaces for tool use
- Extend the capabilities of LLMs beyond their training data

## Adding New Servers

This repository will continue to grow with additional specialized MCP servers. Planned additions include:

- Database interaction servers
- Code execution environments
- Specialized API integrations
- Media processing tools

## Configuration

Each server has its own configuration requirements. See the individual server directories for specific setup instructions.

## Usage with Claude

MCP servers can be used with Claude through Claude Desktop and other compatible interfaces. Each server provides detailed instructions for setup and usage.

## Contributing

Contributions are welcome! If you have ideas for new MCP servers or improvements to existing ones, please feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

All servers in this collection are licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.
