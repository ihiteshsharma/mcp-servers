/**
 * Figma Plugin for MCP Server
 * 
 * This is the main plugin code that runs in the Figma environment
 * and communicates with the MCP server
 */

// Command types supported by the plugin
type CommandType = 
  | 'CREATE_WIREFRAME'
  | 'ADD_ELEMENT' 
  | 'STYLE_ELEMENT'
  | 'MODIFY_ELEMENT'
  | 'ARRANGE_LAYOUT'
  | 'EXPORT_DESIGN'
  | 'GET_SELECTION'
  | 'GET_CURRENT_PAGE';

// Message structure for communication
interface PluginMessage {
  type: CommandType;
  payload: any;
  id: string;
}

// Response structure
interface PluginResponse {
  type: string;
  success: boolean;
  data?: any;
  error?: string;
  id?: string;
}

// Function to send a response back to the MCP server
function sendResponse(response: PluginResponse): void {
  figma.ui.postMessage(response);
}

// Handle messages from the MCP server
figma.ui.onmessage = async (message: PluginMessage) => {
  console.log('Plugin received message:', message);
  
  try {
    switch (message.type) {
      case 'CREATE_WIREFRAME':
        await handleCreateWireframe(message);
        break;
      case 'ADD_ELEMENT':
        await handleAddElement(message);
        break;
      case 'STYLE_ELEMENT':
        await handleStyleElement(message);
        break;
      case 'MODIFY_ELEMENT':
        await handleModifyElement(message);
        break;
      case 'ARRANGE_LAYOUT':
        await handleArrangeLayout(message);
        break;
      case 'EXPORT_DESIGN':
        await handleExportDesign(message);
        break;
      case 'GET_SELECTION':
        handleGetSelection(message);
        break;
      case 'GET_CURRENT_PAGE':
        handleGetCurrentPage(message);
        break;
      default:
        throw new Error(`Unknown command type: ${message.type}`);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({
      type: message.type,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      id: message.id
    });
  }
};

/**
 * Creates a new wireframe based on the description and parameters
 */
async function handleCreateWireframe(message: PluginMessage): Promise<void> {
  const { description, pages, style, designSystem, dimensions } = message.payload;
  
  // Create a new page for the wireframe
  const page = figma.createPage();
  page.name = 'Wireframe: ' + description.slice(0, 20) + '...';
  
  // Set the page as current
  figma.currentPage = page;
  
  // Create frames for all the specified pages
  const pageFrames: FrameNode[] = [];
  const pageIds: string[] = [];
  
  // Default frame size
  const width = dimensions?.width || 1440;
  const height = dimensions?.height || 900;
  
  // Create a frame for each page
  for (const pageName of pages || ['Home']) {
    const frame = figma.createFrame();
    frame.name = pageName;
    frame.resize(width, height);
    frame.x = pageFrames.length * (width + 100); // Space frames apart
    
    // Apply base styling based on the specified style
    applyBaseStyle(frame, style, designSystem);
    
    pageFrames.push(frame);
    pageIds.push(frame.id);
  }
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    data: {
      wireframeId: page.id,
      pageIds: pageIds
    },
    id: message.id
  });
}

/**
 * Applies base styling to a frame based on design parameters
 */
function applyBaseStyle(frame: FrameNode, style: string = 'minimal', designSystem?: any): void {
  // Set background color based on style
  switch (style.toLowerCase()) {
    case 'minimal':
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      break;
    case 'dark':
      frame.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
      break;
    case 'colorful':
      frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
      break;
    default:
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  }
}

/**
 * Adds a new element to the design
 */
async function handleAddElement(message: PluginMessage): Promise<void> {
  const { elementType, parent, properties } = message.payload;
  
  // Get the parent node
  const parentNode = figma.getNodeById(parent);
  if (!parentNode || !(parentNode.type === 'FRAME' || parentNode.type === 'GROUP' || parentNode.type === 'COMPONENT' || parentNode.type === 'INSTANCE')) {
    throw new Error(`Invalid parent node: ${parent}`);
  }
  
  let element: BaseNode | null = null;
  
  // Create the element based on the type
  switch (elementType) {
    case 'TEXT':
      element = createTextElement(parentNode, properties);
      break;
    case 'RECTANGLE':
      element = createRectangleElement(parentNode, properties);
      break;
    case 'BUTTON':
      element = createButtonElement(parentNode, properties);
      break;
    case 'INPUT':
      element = createInputElement(parentNode, properties);
      break;
    case 'FRAME':
      element = createFrameElement(parentNode, properties);
      break;
    case 'NAVBAR':
      element = createNavbarElement(parentNode, properties);
      break;
    case 'CARD':
      element = createCardElement(parentNode, properties);
      break;
    case 'FOOTER':
      element = createFooterElement(parentNode, properties);
      break;
    default:
      throw new Error(`Unsupported element type: ${elementType}`);
  }
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    data: element.id,
    id: message.id
  });
}

/**
 * Creates a text element with the specified properties
 */
function createTextElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): TextNode {
  const text = figma.createText();
  parent.appendChild(text);
  
  // Apply basic text properties
  if (properties.name) text.name = properties.name;
  if (properties.x !== undefined) text.x = properties.x;
  if (properties.y !== undefined) text.y = properties.y;
  if (properties.width !== undefined) text.resize(properties.width, text.height);
  
  // Apply text-specific properties
  // Note: In a real implementation, we would need to load fonts first
  // This is simplified for the example
  if (properties.content) {
    text.characters = properties.content;
  }
  
  return text;
}

/**
 * Creates a rectangle element with the specified properties
 */
function createRectangleElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): RectangleNode {
  const rect = figma.createRectangle();
  parent.appendChild(rect);
  
  // Apply basic properties
  if (properties.name) rect.name = properties.name;
  if (properties.x !== undefined) rect.x = properties.x;
  if (properties.y !== undefined) rect.y = properties.y;
  if (properties.width !== undefined && properties.height !== undefined) {
    rect.resize(properties.width, properties.height);
  }
  
  return rect;
}

/**
 * Creates a button element with the specified properties
 */
function createButtonElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): FrameNode {
  // Create a frame for the button
  const button = figma.createFrame();
  button.name = properties.name || 'Button';
  parent.appendChild(button);
  
  // Apply basic properties
  if (properties.x !== undefined) button.x = properties.x;
  if (properties.y !== undefined) button.y = properties.y;
  
  // Set button size
  const width = properties.width || 120;
  const height = properties.height || 40;
  button.resize(width, height);
  
  // Set button corner radius
  if (properties.cornerRadius !== undefined) {
    button.cornerRadius = properties.cornerRadius;
  } else {
    button.cornerRadius = 4; // Default radius
  }
  
  // Create button text
  const text = figma.createText();
  button.appendChild(text);
  text.characters = properties.text || 'Button';
  text.textAlignHorizontal = 'CENTER';
  text.textAlignVertical = 'CENTER';
  
  // Center the text in the button
  text.resize(width, height);
  
  return button;
}

/**
 * Creates an input element with the specified properties
 */
function createInputElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): FrameNode {
  // Create a frame for the input
  const input = figma.createFrame();
  input.name = properties.name || 'Input Field';
  parent.appendChild(input);
  
  // Apply basic properties
  if (properties.x !== undefined) input.x = properties.x;
  if (properties.y !== undefined) input.y = properties.y;
  
  // Set input size
  const width = properties.width || 240;
  const height = properties.height || 40;
  input.resize(width, height);
  
  // Set input corner radius
  if (properties.cornerRadius !== undefined) {
    input.cornerRadius = properties.cornerRadius;
  } else {
    input.cornerRadius = 4; // Default radius
  }
  
  // Create placeholder text
  const text = figma.createText();
  input.appendChild(text);
  text.characters = properties.placeholder || 'Enter text...';
  text.textAlignVertical = 'CENTER';
  
  // Position the text inside the input with padding
  text.x = 8;
  text.resize(width - 16, height);
  
  return input;
}

/**
 * Creates a frame element with the specified properties
 */
function createFrameElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): FrameNode {
  const frame = figma.createFrame();
  parent.appendChild(frame);
  
  // Apply basic properties
  if (properties.name) frame.name = properties.name;
  if (properties.x !== undefined) frame.x = properties.x;
  if (properties.y !== undefined) frame.y = properties.y;
  
  // Set frame size
  const width = properties.width || 200;
  const height = properties.height || 200;
  frame.resize(width, height);
  
  // Apply corner radius if specified
  if (properties.cornerRadius !== undefined) {
    frame.cornerRadius = properties.cornerRadius;
  }
  
  return frame;
}

/**
 * Creates a simple navbar element
 */
function createNavbarElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): FrameNode {
  const navbar = figma.createFrame();
  navbar.name = properties.name || 'Navigation Bar';
  parent.appendChild(navbar);
  
  // Apply basic properties
  if (properties.x !== undefined) navbar.x = properties.x;
  if (properties.y !== undefined) navbar.y = properties.y;
  
  // Set navbar size - typically full width and fixed height
  const width = properties.width || parent.width;
  const height = properties.height || 60;
  navbar.resize(width, height);
  
  // Setup auto layout
  navbar.layoutMode = 'HORIZONTAL';
  navbar.primaryAxisAlignItems = 'SPACE_BETWEEN';
  navbar.counterAxisAlignItems = 'CENTER';
  navbar.paddingLeft = 20;
  navbar.paddingRight = 20;
  
  // Create logo/brand text
  const brandText = figma.createText();
  navbar.appendChild(brandText);
  brandText.characters = (properties.logo && properties.logo.text) || 'Brand';
  
  // Create links container
  const linksContainer = figma.createFrame();
  navbar.appendChild(linksContainer);
  linksContainer.name = 'Links';
  linksContainer.layoutMode = 'HORIZONTAL';
  linksContainer.itemSpacing = 24;
  linksContainer.fills = [];
  
  // Add navigation links
  const links = properties.links || [
    { text: 'Home' },
    { text: 'About' },
    { text: 'Services' },
    { text: 'Contact' }
  ];
  
  for (const link of links) {
    const linkText = figma.createText();
    linksContainer.appendChild(linkText);
    linkText.characters = link.text;
  }
  
  return navbar;
}

/**
 * Creates a card element with the specified properties
 */
function createCardElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): FrameNode {
  const card = figma.createFrame();
  card.name = properties.name || 'Card';
  parent.appendChild(card);
  
  // Apply basic properties
  if (properties.x !== undefined) card.x = properties.x;
  if (properties.y !== undefined) card.y = properties.y;
  
  // Set card size
  const width = properties.width || 300;
  const height = properties.height || 350;
  card.resize(width, height);
  
  // Set card corner radius
  if (properties.cornerRadius !== undefined) {
    card.cornerRadius = properties.cornerRadius;
  } else {
    card.cornerRadius = 8; // Default radius
  }
  
  // Setup auto layout
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 16;
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  
  // Create image placeholder if needed
  if (properties.image) {
    const imagePlaceholder = figma.createRectangle();
    card.appendChild(imagePlaceholder);
    imagePlaceholder.name = 'Image';
    imagePlaceholder.resize(width - 32, 150);
  }
  
  // Create title if needed
  if (properties.title) {
    const titleText = figma.createText();
    card.appendChild(titleText);
    titleText.characters = properties.title;
  }
  
  // Create description if needed
  if (properties.description) {
    const descriptionText = figma.createText();
    card.appendChild(descriptionText);
    descriptionText.characters = properties.description;
  }
  
  return card;
}

/**
 * Creates a footer element with the specified properties
 */
function createFooterElement(parent: FrameNode | GroupNode | ComponentNode | InstanceNode, properties: any): FrameNode {
  const footer = figma.createFrame();
  footer.name = properties.name || 'Footer';
  parent.appendChild(footer);
  
  // Apply basic properties
  if (properties.x !== undefined) footer.x = properties.x;
  if (properties.y !== undefined) footer.y = properties.y;
  
  // Set footer size - typically full width and fixed height
  const width = properties.width || parent.width;
  const height = properties.height || 200;
  footer.resize(width, height);
  
  // Setup auto layout
  footer.layoutMode = 'VERTICAL';
  footer.primaryAxisAlignItems = 'CENTER';
  footer.counterAxisAlignItems = 'CENTER';
  footer.paddingTop = 40;
  footer.paddingBottom = 40;
  
  // Create columns container if needed
  if (properties.columns && properties.columns.length > 0) {
    const columnsContainer = figma.createFrame();
    footer.appendChild(columnsContainer);
    columnsContainer.name = 'Columns';
    columnsContainer.layoutMode = 'HORIZONTAL';
    columnsContainer.itemSpacing = 48;
    columnsContainer.fills = [];
    columnsContainer.resize(width - 80, 120);
    
    // Create columns
    for (const column of properties.columns) {
      const columnFrame = figma.createFrame();
      columnsContainer.appendChild(columnFrame);
      columnFrame.name = column.title || 'Column';
      columnFrame.layoutMode = 'VERTICAL';
      columnFrame.itemSpacing = 12;
      columnFrame.fills = [];
      
      // Add column title
      if (column.title) {
        const titleText = figma.createText();
        columnFrame.appendChild(titleText);
        titleText.characters = column.title;
      }
      
      // Add links
      if (column.links && column.links.length > 0) {
        for (const link of column.links) {
          const linkText = figma.createText();
          columnFrame.appendChild(linkText);
          linkText.characters = link.text;
        }
      }
    }
  }
  
  // Create copyright text if needed
  if (properties.copyright) {
    const copyrightText = figma.createText();
    footer.appendChild(copyrightText);
    copyrightText.characters = properties.copyright;
  }
  
  return footer;
}

/**
 * Applies styling to an existing element
 */
async function handleStyleElement(message: PluginMessage): Promise<void> {
  const { elementId, styles } = message.payload;
  
  // Get the element to style
  const element = figma.getNodeById(elementId);
  if (!element) {
    throw new Error(`Element not found: ${elementId}`);
  }
  
  // Apply styles based on element type
  // This is a simplified implementation
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    id: message.id
  });
}

/**
 * Modifies an existing element
 */
async function handleModifyElement(message: PluginMessage): Promise<void> {
  const { elementId, modifications } = message.payload;
  
  // Get the element to modify
  const element = figma.getNodeById(elementId);
  if (!element) {
    throw new Error(`Element not found: ${elementId}`);
  }
  
  // Apply modifications based on element type
  // This is a simplified implementation
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    id: message.id
  });
}

/**
 * Arranges elements in a layout
 */
async function handleArrangeLayout(message: PluginMessage): Promise<void> {
  const { parentId, layout, properties } = message.payload;
  
  // Get the parent container
  const parent = figma.getNodeById(parentId);
  if (!parent || parent.type !== 'FRAME') {
    throw new Error(`Invalid parent node for layout: ${parentId}`);
  }
  
  const frame = parent as FrameNode;
  
  // Apply layout
  switch (layout) {
    case 'HORIZONTAL':
      frame.layoutMode = 'HORIZONTAL';
      break;
    case 'VERTICAL':
      frame.layoutMode = 'VERTICAL';
      break;
    case 'GRID':
      // For grid, we can't set it directly as a layout mode in Figma
      // We would need a custom implementation
      break;
    case 'NONE':
    default:
      frame.layoutMode = 'NONE';
      break;
  }
  
  // Apply additional layout properties
  if (properties) {
    if (properties.itemSpacing !== undefined) {
      frame.itemSpacing = properties.itemSpacing;
    }
    
    if (properties.paddingLeft !== undefined) frame.paddingLeft = properties.paddingLeft;
    if (properties.paddingRight !== undefined) frame.paddingRight = properties.paddingRight;
    if (properties.paddingTop !== undefined) frame.paddingTop = properties.paddingTop;
    if (properties.paddingBottom !== undefined) frame.paddingBottom = properties.paddingBottom;
    
    if (properties.primaryAxisAlignItems) {
      frame.primaryAxisAlignItems = properties.primaryAxisAlignItems;
    }
    
    if (properties.counterAxisAlignItems) {
      frame.counterAxisAlignItems = properties.counterAxisAlignItems;
    }
  }
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    id: message.id
  });
}

/**
 * Exports a design
 */
async function handleExportDesign(message: PluginMessage): Promise<void> {
  const { selection, settings } = message.payload;
  
  let nodesToExport: SceneNode[] = [];
  
  // If specific nodes are selected for export
  if (selection && selection.length > 0) {
    for (const id of selection) {
      const node = figma.getNodeById(id);
      if (node && 'exportAsync' in node) {
        nodesToExport.push(node as SceneNode);
      }
    }
  } 
  // Otherwise export the current selection
  else if (figma.currentPage.selection.length > 0) {
    nodesToExport = figma.currentPage.selection.filter(node => 'exportAsync' in node);
  }
  // If no selection, export the current page
  else {
    nodesToExport = [figma.currentPage];
  }
  
  if (nodesToExport.length === 0) {
    throw new Error('No valid nodes to export');
  }
  
  // Export each node
  const exportPromises = nodesToExport.map(async node => {
    const format = settings.format || 'PNG';
    const scale = settings.constraint?.value || 1;
    
    // Export the node
    const bytes = await (node as ExportMixin).exportAsync({
      format: format as 'PNG' | 'JPG' | 'SVG' | 'PDF',
      constraint: { type: 'SCALE', value: scale }
    });
    
    // Convert to base64
    const base64 = figma.base64Encode(bytes);
    
    return {
      name: node.name,
      data: base64,
      format: format.toLowerCase(),
      nodeId: node.id
    };
  });
  
  // Wait for all exports to complete
  const exportResults = await Promise.all(exportPromises);
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    data: {
      files: exportResults
    },
    id: message.id
  });
}

/**
 * Gets the current selection
 */
function handleGetSelection(message: PluginMessage): void {
  const selection = figma.currentPage.selection.map(node => ({
    id: node.id,
    name: node.name,
    type: node.type
  }));
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    data: selection,
    id: message.id
  });
}

/**
 * Gets the current page info
 */
function handleGetCurrentPage(message: PluginMessage): void {
  const page = {
    id: figma.currentPage.id,
    name: figma.currentPage.name,
    childrenCount: figma.currentPage.children.length
  };
  
  // Send success response
  sendResponse({
    type: message.type,
    success: true,
    data: page,
    id: message.id
  });
}

// Start the plugin and create a hidden UI to handle messages
figma.showUI(__html__, { visible: false });
console.log('Figma plugin initialized and ready for commands'); 