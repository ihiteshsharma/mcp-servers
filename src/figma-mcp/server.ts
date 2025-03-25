import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import resources
import { listDesignTemplates, getDesignTemplate } from "./resources/designTemplates.js";
import { listComponents, getComponent } from "./resources/components.js";
import { listDesignSystems, getDesignSystem } from "./resources/designSystems.js";
import { saveUserRequirements, getUserRequirements } from "./resources/userRequirements.js";

// Import tools
import { createWireframe } from "./tools/createWireframe.js";
import { addElement } from "./tools/addElement.js";
import { styleElement } from "./tools/styleElement.js";
import { modifyElement } from "./tools/modifyElement.js";
import { arrangeLayout } from "./tools/arrangeLayout.js";
import { exportDesign } from "./tools/exportDesign.js";

// Import prompts
import { wireframeCreationPrompt } from "./prompts/wireframeCreation.js";
import { designRefinementPrompt } from "./prompts/designRefinement.js";
import { componentCreationPrompt } from "./prompts/componentCreation.js";

/**
 * Main entry point for the Figma MCP Server
 * This server enables LLMs to create and manipulate Figma designs through MCP
 */
async function main() {
  // Create an MCP server
  const server = new McpServer({
    name: "Figma Design Server",
    version: "1.0.0",
    description: "MCP server for creating professional website designs in Figma"
  });

  // Register resources
  server.resource(
    "design-templates",
    "design-templates://list",
    async () => listDesignTemplates()
  );
  
  server.resource(
    "design-template",
    new ResourceTemplate("design-templates://{templateId}", { list: "design-templates://list" }),
    async (uri, { templateId }) => getDesignTemplate(templateId)
  );

  server.resource(
    "components",
    "components://list",
    async () => listComponents()
  );
  
  server.resource(
    "component",
    new ResourceTemplate("components://{componentId}", { list: "components://list" }),
    async (uri, { componentId }) => getComponent(componentId)
  );

  server.resource(
    "design-systems",
    "design-systems://list",
    async () => listDesignSystems()
  );
  
  server.resource(
    "design-system",
    new ResourceTemplate("design-systems://{systemId}", { list: "design-systems://list" }),
    async (uri, { systemId }) => getDesignSystem(systemId)
  );

  server.resource(
    "user-requirements",
    "user-requirements://current",
    async () => getUserRequirements()
  );

  // Register tools
  server.tool(
    "create-wireframe",
    {
      description: z.string().describe("Description of the website or app to create"),
      pages: z.array(z.string()).optional().describe("List of pages to include in the wireframe"),
      style: z.string().optional().describe("Design style to apply (e.g., 'minimal', 'corporate', 'creative')"),
      designSystemId: z.string().optional().describe("ID of a design system to use")
    },
    async (params) => createWireframe(params)
  );

  server.tool(
    "add-element",
    {
      elementType: z.enum(["button", "input", "text", "image", "container", "navbar", "card", "footer"]),
      parent: z.string().describe("ID of the parent element/frame to add this element to"),
      properties: z.record(z.any()).describe("Element properties like text content, size, etc.")
    },
    async (params) => addElement(params)
  );

  server.tool(
    "style-element",
    {
      elementId: z.string().describe("ID of the element to style"),
      styles: z.record(z.any()).describe("Styles to apply (colors, typography, etc.)")
    },
    async (params) => styleElement(params)
  );

  server.tool(
    "modify-element",
    {
      elementId: z.string().describe("ID of the element to modify"),
      modifications: z.record(z.any()).describe("Changes to apply to the element")
    },
    async (params) => modifyElement(params)
  );

  server.tool(
    "arrange-layout",
    {
      parentId: z.string().describe("ID of the parent container"),
      layout: z.enum(["flex", "grid", "auto"]).default("auto"),
      properties: z.record(z.any()).optional().describe("Layout properties")
    },
    async (params) => arrangeLayout(params)
  );

  server.tool(
    "export-design",
    {
      format: z.enum(["png", "jpg", "svg", "pdf"]).default("png"),
      scale: z.number().default(1).describe("Export scale factor"),
      selection: z.array(z.string()).optional().describe("Specific element IDs to export, or empty for entire design")
    },
    async (params) => exportDesign(params)
  );

  server.tool(
    "save-requirements",
    {
      requirements: z.string().describe("User requirements for the design"),
      target: z.string().optional().describe("Target audience"),
      purpose: z.string().optional().describe("Purpose of the design"),
      keyFeatures: z.array(z.string()).optional().describe("Key features to include")
    },
    async (params) => saveUserRequirements(params)
  );

  // Register prompts
  server.prompt(
    "wireframe-creation",
    {
      description: z.string().describe("Description of the website to wireframe"),
      pages: z.array(z.string()).optional().describe("Pages to include"),
      style: z.string().optional().describe("Design style preferences")
    },
    (params) => wireframeCreationPrompt(params)
  );

  server.prompt(
    "design-refinement",
    {
      designId: z.string().describe("ID of the design to refine"),
      feedback: z.string().describe("Feedback to incorporate"),
      focusAreas: z.array(z.string()).optional().describe("Areas to focus refinement on")
    },
    (params) => designRefinementPrompt(params)
  );

  server.prompt(
    "component-creation",
    {
      componentType: z.string().describe("Type of component to create"),
      properties: z.record(z.any()).describe("Component properties")
    },
    (params) => componentCreationPrompt(params)
  );

  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  console.error("Figma MCP Server starting...");
  await server.connect(transport);
  console.error("Figma MCP Server connected!");
}

// Handle errors
main().catch(error => {
  console.error("Figma MCP Server error:", error);
  process.exit(1);
}); 