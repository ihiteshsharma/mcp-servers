/**
 * Add Element Tool
 * 
 * This tool adds a specific UI element to an existing design in Figma
 * It handles adding various types of elements based on the elementType parameter
 */

import { 
  createElement, 
  ElementType, 
  createText, 
  createButton, 
  createInput, 
  createContainer, 
  createNavbar, 
  createCard, 
  createFooter, 
  createImage 
} from '../elementCreator';
import { ToolResult } from '../types';

export interface AddElementParams {
  elementType: 'button' | 'input' | 'text' | 'image' | 'container' | 'navbar' | 'card' | 'footer';
  parent: string;
  properties: any;
}

/**
 * Maps the MCP element type to the Figma ElementType enum
 */
function mapElementType(type: string): ElementType {
  const typeMap: Record<string, ElementType> = {
    'button': ElementType.BUTTON,
    'input': ElementType.INPUT,
    'text': ElementType.TEXT,
    'image': ElementType.IMAGE,
    'container': ElementType.FRAME,
    'navbar': ElementType.NAVBAR,
    'card': ElementType.CARD,
    'footer': ElementType.FOOTER
  };
  
  return typeMap[type] || ElementType.FRAME;
}

/**
 * Creates a specialized element based on the elementType
 */
async function createSpecializedElement(
  params: AddElementParams
): Promise<string> {
  const { elementType, parent, properties } = params;
  
  switch (elementType) {
    case 'text':
      return createText(parent, properties);
    case 'button':
      return createButton(parent, properties);
    case 'input':
      return createInput(parent, properties);
    case 'container':
      return createContainer(parent, properties);
    case 'navbar':
      return createNavbar(parent, properties);
    case 'card':
      return createCard(parent, properties);
    case 'footer':
      return createFooter(parent, properties);
    case 'image':
      return createImage(parent, properties);
    default:
      return createElement(parent, mapElementType(elementType), properties);
  }
}

/**
 * Adds an element to an existing design based on the provided parameters
 */
export async function addElement(params: AddElementParams): Promise<ToolResult> {
  try {
    console.log(`Adding ${params.elementType} element to parent: ${params.parent}`);
    
    // Create the element using the appropriate creator function
    const elementId = await createSpecializedElement(params);
    
    // Return success response with element information
    return {
      content: [
        {
          type: 'text',
          text: `${params.elementType} element created successfully with ID: ${elementId}`
        }
      ],
      data: {
        elementId,
        elementType: params.elementType
      }
    };
  } catch (error) {
    console.error('Error adding element:', error);
    
    // Return error response
    return {
      content: [
        {
          type: 'text',
          text: `Failed to add element: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
} 