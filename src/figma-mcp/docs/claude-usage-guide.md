# Using the Figma MCP Server with Claude

This guide explains how to effectively use the Figma MCP Server with Claude to create and manipulate designs.

## Local Setup

1. **Clone and build the Figma MCP Server**
   ```bash
   git clone https://github.com/ihiteshsharma/figma-mcp-server.git
   cd figma-mcp-server
   npm install
   npm run build
   ```

2. **Configure Claude Desktop** 
   Add to your `claude_desktop_config.json`:
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
   
3. **Set up the Figma plugin** following the instructions in the main README

## Basic Workflow

The general workflow when using Claude with the Figma MCP Server is:

1. **Describe your design needs** to Claude
2. Claude will use the MCP server to **create a wireframe**
3. Claude will **add and style elements** to build the design
4. You can provide **feedback for refinement**
5. When satisfied, you can **export the design**

## Checking MCP Server Connectivity

Before starting, make sure Claude can connect to your local MCP server:

1. Start Claude Desktop
2. Ask Claude: "Can you check if the Figma MCP server is available?"
3. Claude should respond confirming the connection

If there are connection issues:
- Make sure the server is built (`npm run build`)
- Check your `claude_desktop_config.json` paths are correct
- Try restarting Claude Desktop

## Effective Prompting

When working with Claude and the Figma MCP Server, consider these prompting strategies:

### 1. Be Specific About Design Requirements

```
Please create a wireframe for an e-commerce website that sells handmade jewelry.
The site should have these pages:
- Home page with featured products
- Shop page with product grid
- Product detail page
- About page
- Contact page

The design style should be minimal and elegant, with plenty of whitespace to showcase product photography.
```

### 2. Refer to Elements by Their IDs

When asking Claude to modify or style elements, refer to them by the IDs it provides:

```
Please style the navigation bar (element-123) with a white background and black text.
Also, make the hero image (element-456) larger and add a subtle shadow to it.
```

### 3. Request Progressive Design Development

Break down the design process into stages:

```
First, create a basic wireframe for the homepage with the main structural elements.
Then, let's focus on the navigation and header section before moving to the content areas.
```

### 4. Provide Specific Feedback for Refinement

When requesting design refinements, be specific about what you want to change:

```
The current navigation bar is too prominent. Please make it more subtle by:
1. Reducing its height by 20%
2. Changing the background color to a light gray (#f8f8f8)
3. Reducing the font weight of the menu items
```

### 5. Use Design System Terminology

To get more consistent results, use design system terminology:

```
Please apply the following styling to the buttons:
- Primary buttons: #0066cc background, white text, 8px border radius
- Secondary buttons: white background, #0066cc border and text, 8px border radius
- Text buttons: No background, #0066cc text, no border
```

## Example Conversation

Here's an example conversation that demonstrates the workflow:

---

**User:** I need to design a landing page for a fitness app that helps users track their workouts and nutrition. Can you help me create a wireframe?

**Claude:** I'll help you create a wireframe for your fitness app landing page. Let me use the Figma MCP server to build this.

First, I'll create a basic wireframe structure with the key sections needed for a fitness app landing page.

[Claude uses create-wireframe tool]

I've created a wireframe for your fitness app landing page. The wireframe has a clean, modern design with these key sections:
- Navigation bar with app name and menu items
- Hero section with app value proposition
- Features section highlighting key app capabilities
- App screenshot showcase
- Testimonials section
- Download/call-to-action section
- Footer with links

The wireframe ID is wireframe-123. Would you like me to make any specific adjustments to this structure?

**User:** Looks good! Can you add a section showing the different subscription options between the features and screenshots?

**Claude:** I'll add a subscription section between the features and screenshots.

[Claude uses add-element tool]

I've added a pricing/subscription section between the features and screenshots. The section includes:
- A heading "Choose Your Plan"
- Three pricing cards arranged in a row, each with:
  - Plan name
  - Price
  - List of features
  - "Get Started" button

The pricing section ID is element-456. Would you like me to adjust the styling or add more details to the subscription options?

**User:** Make the middle plan stand out as the recommended option, and use a blue color scheme for the buttons.

**Claude:** I'll make the middle subscription plan stand out and apply a blue color scheme to the buttons.

[Claude uses style-element and modify-element tools]

I've updated the subscription section:
1. Middle plan now stands out with:
   - Slightly larger card
   - "Recommended" badge at the top
   - More prominent border
   - Background with subtle highlight

2. Applied blue color scheme to buttons:
   - Primary buttons (#0066aa with white text)
   - "Get Started" button on recommended plan has deeper blue (#004c8c)

The changes have been applied to element-456 and its child elements. Would you like to see other sections styled with the same color scheme for consistency?

---

## Troubleshooting

If you encounter issues:

1. **Server connection problems**:
   - Check that the server is running (`npm start` in the project directory)
   - Verify your Claude Desktop configuration paths
   - Restart Claude Desktop to pick up configuration changes

2. **Element creation fails**: 
   - Check if the parent element ID is correct
   - Look for error messages in the server console output

3. **Styling doesn't apply**: 
   - Verify the element type supports the requested styles
   - Check the element ID is correct

4. **Figma plugin not responding**: 
   - Ensure the plugin is installed and running
   - Check the Figma console for errors (Plugins > Development > Console)

5. **MCP server logs**: 
   - Run the server in a terminal to see debug messages
   - Use the MCP Inspector to test tools independently

## Further Resources

- [Figma Documentation](https://help.figma.com)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 