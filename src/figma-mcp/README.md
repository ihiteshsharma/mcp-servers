# Figma MCP Server

A Model Context Protocol (MCP) server implementation that integrates with Figma, enabling LLMs to create and manipulate designs through a structured API. This server allows AI assistants to create wireframes, add UI elements, style components, arrange layouts, and export designs—all through Figma's native capabilities.

## Features

- **Wireframe Creation**: Generate website layouts based on descriptions
- **Element Creation**: Add UI components like buttons, inputs, text, and containers
- **Element Styling**: Apply colors, typography, and effects to elements
- **Layout Arrangement**: Organize elements with auto-layout, grids, and positioning
- **Design Refinement**: Improve existing designs based on feedback
- **Design Export**: Export designs as PNG, JPG, SVG, or PDF
- **Resource Management**: Access design templates, components, and design systems
- **User Requirements**: Store and retrieve design specifications

## Tools

- **create-wireframe**
  - Generate initial wireframe based on description
  - Inputs:
    - `description` (string): Description of the website or app to create
    - `pages` (array, optional): List of pages to include in the wireframe
    - `style` (string, optional): Design style to apply (e.g., 'minimal', 'corporate', 'creative')
    - `designSystemId` (string, optional): ID of a design system to use

- **add-element**
  - Add a UI element to an existing design
  - Inputs:
    - `elementType` (enum): Type of element to add (button, input, text, image, container, navbar, card, footer)
    - `parent` (string): ID of the parent element/frame to add this element to
    - `properties` (object): Element properties like text content, size, etc.

- **style-element**
  - Apply styling to an element
  - Inputs:
    - `elementId` (string): ID of the element to style
    - `styles` (object): Styles to apply (colors, typography, etc.)

- **modify-element**
  - Change properties of an existing element
  - Inputs:
    - `elementId` (string): ID of the element to modify
    - `modifications` (object): Changes to apply to the element

- **arrange-layout**
  - Organize elements within a container
  - Inputs:
    - `parentId` (string): ID of the parent container
    - `layout` (enum): Layout type to apply (flex, grid, auto)
    - `properties` (object, optional): Layout properties

- **export-design**
  - Export design as image or PDF
  - Inputs:
    - `format` (enum): Export format (png, jpg, svg, pdf)
    - `scale` (number): Export scale factor
    - `selection` (array, optional): Specific element IDs to export, or empty for entire design

- **save-requirements**
  - Save user requirements for a design
  - Inputs:
    - `requirements` (string): User requirements for the design
    - `target` (string, optional): Target audience
    - `purpose` (string, optional): Purpose of the design
    - `keyFeatures` (array, optional): Key features to include

## Prompts

The server includes specialized prompts to guide LLMs:

- **wireframe-creation**: Guide for creating initial wireframes
- **design-refinement**: Guide for improving designs based on feedback
- **component-creation**: Guide for creating reusable UI components

## Local Setup & Installation

### Prerequisites

1. Node.js 18+ and npm
2. Figma Desktop app
3. Figma developer account (for plugin installation)

### Server Installation

```bash
# Clone this repository
git clone https://github.com/your-username/figma-mcp-server.git
cd figma-mcp-server

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Start the server locally
npm start
```

### Figma Plugin Setup

1. **Create a new plugin in Figma**
   - In Figma, go to `Plugins > Development > New Plugin`
   - Choose `Empty Plugin` template
   - Enter a name and ID for your plugin (e.g., "MCP Server Plugin")

2. **Set up the plugin files**
   - Copy the contents of `figma-plugin/manifest.json`, `figma-plugin/code.ts`, and `figma-plugin/ui.html` to your new plugin directory
   - Update the `manifest.json` with your plugin ID (the one Figma generated for you)

3. **Build the plugin**
   - In your plugin directory, run:
   ```bash
   # If you have the Figma CLI installed
   npx @figma/plugin-build
   ```

4. **Load the plugin in Figma**
   - In Figma, go to `Plugins > Development > Import plugin from manifest...`
   - Select the `manifest.json` file from your plugin directory

## Testing with Claude Desktop

Since this is not published to npm, you'll need to run the server locally and point Claude Desktop to it.

### Configure Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": [
        "/path/to/your/figma-mcp-server/dist/server.js"
      ],
      "cwd": "/path/to/your/figma-mcp-server"
    }
  }
}
```

Replace `/path/to/your/figma-mcp-server` with the actual path where you cloned the repository.

## Testing with MCP Inspector

The MCP Inspector is a tool that helps you test and debug MCP servers locally.

1. **Install the MCP Inspector**
   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. **Run the Inspector with your local Figma MCP Server**
   ```bash
   # Navigate to your project directory
   cd path/to/figma-mcp-server
   
   # Run the inspector pointing to your local server
   modelcontextprotocol-inspector --server "node ./dist/server.js"
   ```

3. **Test tools and resources**
   - Use the Inspector UI to test each tool
   - View request and response payloads
   - Debug errors and unexpected behaviors

## Running Tests

This project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Or use the provided script
./scripts/run-tests.sh
```

## Example Usage with Claude

Here are some examples of how to use the Figma MCP server with Claude:

1. **Create a wireframe**
   ```
   Please create a wireframe for an e-commerce website that sells handmade jewelry. It should have a clean, minimal design with a focus on product photography.
   ```

2. **Add elements to a wireframe**
   ```
   Please add a navigation bar to the wireframe with links to Home, Shop, About, and Contact pages. Also add a hero section with a large product image and a call-to-action button.
   ```

3. **Style elements**
   ```
   Please style the navigation bar with a white background and black text. Make the CTA button have a gold background with white text.
   ```

4. **Arrange layout**
   ```
   Please arrange the product cards in a 3-column grid layout with 24px spacing between items.
   ```

5. **Export the design**
   ```
   Please export the entire design as a PNG file at 2x resolution.
   ```

## Project Structure

```
figma-mcp-server/
├── src/
│   ├── tools/              # Tool implementations
│   ├── resources/          # Resource implementations
│   ├── prompts/            # Prompt templates
│   ├── figma-plugin/       # Figma plugin files
│   ├── __tests__/          # Test files
│   ├── elementCreator.ts   # Element creation utilities
│   ├── plugin-bridge.ts    # Communication with Figma plugin
│   └── server.ts           # Main MCP server implementation
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── package.json           # Project configuration
```

## Modifying and Extending

To extend the server with custom tools and resources:

1. Create a new file in the appropriate directory (`tools/` or `resources/`)
2. Implement the tool or resource following the existing patterns
3. Register it in `server.ts`
4. Update the plugin code to handle any new commands

## License

This MCP server is licensed under the MIT License. You are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
