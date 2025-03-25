# Developer Getting Started Guide

This guide will help you set up your development environment for contributing to the Figma MCP Server.

## Prerequisites

Before you begin, ensure you have the following tools installed:

- **Node.js** (v18 or later)
- **npm** (comes with Node.js)
- **Git**
- **Figma Desktop** (for testing with the plugin)

## Setting Up Your Development Environment

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/figma-mcp-server.git
   cd figma-mcp-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run the server**

   ```bash
   npm start
   ```

## Development Workflow

### Common npm Scripts

The project includes several npm scripts to help with development:

- `npm run build` - Compiles TypeScript files
- `npm start` - Starts the MCP server
- `npm run dev` - Builds and starts the server (development mode)
- `npm test` - Runs all tests
- `npm run test:watch` - Runs tests in watch mode for development
- `npm run test:coverage` - Runs tests with coverage reports
- `npm run lint` - Runs ESLint to check code quality
- `npm run clean` - Removes build artifacts and coverage reports
- `npm run inspect` - Starts the MCP Inspector with the local server
- `npm run plugin:build` - Builds the Figma plugin

### Making Changes

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test your changes**

   ```bash
   # Run tests to ensure everything works
   npm test
   
   # Check code quality
   npm run lint
   
   # Test with MCP Inspector
   npm run inspect
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

## Testing with Claude Desktop

To test your local MCP server with Claude Desktop:

1. **Build the server**

   ```bash
   npm run build
   ```

2. **Update Claude Desktop configuration**

   Add this to your `claude_desktop_config.json` (replace with your actual path):

   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "node",
         "args": [
           "/absolute/path/to/your/figma-mcp-server/dist/server.js"
         ],
         "cwd": "/absolute/path/to/your/figma-mcp-server"
       }
     }
   }
   ```

3. **Restart Claude Desktop** to pick up the configuration changes

## Testing with MCP Inspector

The MCP Inspector is a useful tool for testing your MCP server:

1. **Install the MCP Inspector** (if not already installed)

   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. **Run the Inspector with your server**

   ```bash
   npm run inspect
   ```

   Or manually:

   ```bash
   modelcontextprotocol-inspector --server "node ./dist/server.js"
   ```

3. **Use the Inspector UI** to test individual tools and resources

## Figma Plugin Development

To develop the Figma plugin:

1. **Create a new plugin in Figma**
   - In Figma, go to `Plugins > Development > New Plugin`
   - Choose `Empty Plugin` template
   - Enter a name (e.g., "MCP Server Plugin") and save the manifest

2. **Copy the plugin code**
   - Copy the contents of your local files:
     - `figma-plugin/manifest.json` to the plugin's manifest file
     - `figma-plugin/code.ts` to the plugin's code file
     - `figma-plugin/ui.html` to the plugin's UI file
   - Make sure to update the plugin ID in the manifest

3. **Build the plugin**

   ```bash
   npm run plugin:build
   ```

   Or install the Figma CLI and build manually:

   ```bash
   npm install -g @figma/plugin-typings
   cd figma-plugin
   npx @figma/plugin-build
   ```

4. **Test the plugin in Figma**
   - In Figma, go to `Plugins > Development > Import plugin from manifest...`
   - Select the manifest file from your plugin directory

## Project Structure

```
figma-mcp-server/
├── src/                    # Source code
│   ├── tools/              # Tool implementations
│   ├── resources/          # Resource implementations
│   ├── prompts/            # Prompt templates
│   ├── server.ts           # Main server implementation
│   └── ...
├── figma-plugin/           # Figma plugin files
│   ├── code.ts             # Plugin code
│   ├── ui.html             # Plugin UI
│   └── manifest.json       # Plugin manifest
├── __tests__/              # Test files
│   ├── mocks/              # Test mocks
│   └── ...
├── dist/                   # Compiled output (generated)
├── coverage/               # Test coverage reports (generated)
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Adding New Features

### Adding a New Tool

1. **Create a new file** in the `tools/` directory
2. **Implement the tool logic** following the existing patterns
3. **Add tests** in the `__tests__/tools/` directory
4. **Register the tool** in `server.ts`
5. **Add handler** in the Figma plugin if needed

### Adding a New Resource

1. **Create a new file** in the `resources/` directory
2. **Implement the resource logic** following the existing patterns
3. **Add tests** in the `__tests__/resources/` directory
4. **Register the resource** in `server.ts`

## Troubleshooting

### Common Issues

- **TypeScript compilation errors**: Make sure your code is type-safe and imports are correct
- **Test failures**: Check for recent changes that might have broken tests
- **MCP server not connecting**: Verify port isn't in use and check logs
- **Plugin communication issues**: Check network permissions in manifest.json

### Debugging

- **Server logs**: Look for errors in the terminal where the server is running
- **Inspector**: Use the MCP Inspector to test individual tools
- **Figma console**: Check `Plugins > Development > Console` for plugin errors

## Getting Help

If you need help or want to discuss the project:

- Open an issue on GitHub
- Contact the project maintainers
- Check the documentation at [project wiki/docs] 