/**
 * Modify Element Tool
 * 
 * This tool modifies properties of an existing element in Figma
 * It handles updating various properties like position, size, text content, etc.
 */

import { modifyElement as updateElement } from '../elementCreator';
import { ToolResult } from '../types';

export interface ModifyElementParams {
  elementId: string;
  modifications: {
    // Position and size
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    
    // Text properties
    characters?: string;
    fontSize?: number;
    fontName?: { family: string; style?: string };
    fontWeight?: number;
    
    // Image properties
    imageHash?: string;
    scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
    
    // General properties
    name?: string;
    visible?: boolean;
    locked?: boolean;
    opacity?: number;
    
    // Node-specific properties
    [key: string]: any;
  };
}

/**
 * Modifies an existing element with the specified properties
 */
export async function modifyElement(params: ModifyElementParams): Promise<ToolResult> {
  try {
    console.log(`Modifying element: ${params.elementId}`);
    
    // Get the keys being modified for logging
    const modificationKeys = Object.keys(params.modifications);
    console.log(`Modification properties: ${modificationKeys.join(', ')}`);
    
    // Apply the modifications to the element
    await updateElement(params.elementId, params.modifications);
    
    // Return success response
    return {
      content: [
        {
          type: 'text',
          text: `Element ${params.elementId} modified successfully with properties: ${modificationKeys.join(', ')}`
        }
      ],
      data: {
        elementId: params.elementId,
        modifiedProperties: modificationKeys
      }
    };
  } catch (error) {
    console.error('Error modifying element:', error);
    
    // Return error response
    return {
      content: [
        {
          type: 'text',
          text: `Failed to modify element: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
} 