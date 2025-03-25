/**
 * Create Wireframe Tool
 * 
 * This tool generates a new wireframe in Figma based on the provided description
 * It handles creating the initial layout, pages, and basic elements
 */

import { sendPluginCommand } from '../plugin-bridge';
import { getDesignSystem } from '../resources/designSystems';
import { ToolResult } from '../types';

export interface CreateWireframeParams {
  description: string;
  pages?: string[];
  style?: string;
  designSystemId?: string;
}

export interface WireframeResult {
  wireframeId: string;
  pageIds: string[];
  previewUrl?: string;
}

/**
 * Creates a new wireframe based on the provided description and parameters
 */
export async function createWireframe(params: CreateWireframeParams): Promise<ToolResult> {
  try {
    console.log(`Creating wireframe with description: ${params.description}`);
    
    // Extract design system if specified
    let designSystem = undefined;
    if (params.designSystemId) {
      const designSystemResult = await getDesignSystem(params.designSystemId);
      designSystem = designSystemResult.contents?.[0]?.data;
      if (!designSystem) {
        throw new Error(`Design system not found: ${params.designSystemId}`);
      }
    }
    
    // Prepare default pages if none provided
    const pages = params.pages || ['Home', 'About', 'Contact'];
    
    // Determine style settings
    const style = params.style || 'minimal';
    
    // Prepare wireframe config
    const wireframeConfig = {
      description: params.description,
      pages,
      style,
      designSystem,
      // Set default dimensions for a standard website
      dimensions: {
        width: 1440,
        height: 900
      }
    };
    
    // Send command to Figma plugin to create the wireframe
    const result = await sendPluginCommand<WireframeResult>({
      type: 'CREATE_WIREFRAME',
      payload: wireframeConfig
    });
    
    // Return success response with wireframe information
    return {
      content: [
        {
          type: 'text',
          text: `Wireframe created successfully with ID: ${result.wireframeId}. Created ${result.pageIds.length} pages.`
        }
      ],
      data: result
    };
  } catch (error) {
    console.error('Error creating wireframe:', error);
    
    // Return error response
    return {
      content: [
        {
          type: 'text',
          text: `Failed to create wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
} 