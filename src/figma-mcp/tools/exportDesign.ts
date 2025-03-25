/**
 * Export Design Tool
 * 
 * This tool exports designs from Figma in various formats
 * It handles exporting entire pages, frames, or specific elements
 */

import { sendPluginCommand } from '../plugin-bridge';
import { ToolResult } from '../types';

export interface ExportDesignParams {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  scale: number;
  selection?: string[];
}

export interface ExportResult {
  files: Array<{
    name: string;
    data: string; // Base64 encoded data
    format: string;
    nodeId?: string;
  }>;
}

/**
 * Exports a design or selection with the specified format and settings
 */
export async function exportDesign(params: ExportDesignParams): Promise<ToolResult> {
  try {
    console.log(`Exporting design with format: ${params.format}, scale: ${params.scale}`);
    
    if (params.selection && params.selection.length > 0) {
      console.log(`Exporting specific selection: ${params.selection.join(', ')}`);
    } else {
      console.log('Exporting entire current selection/page');
    }
    
    // Create export settings
    const exportSettings = {
      format: params.format.toUpperCase(),
      constraint: {
        type: 'SCALE',
        value: params.scale
      }
    };
    
    // Send command to export the design
    const result = await sendPluginCommand<ExportResult>({
      type: 'EXPORT_DESIGN',
      payload: {
        selection: params.selection || [],
        settings: exportSettings
      }
    });
    
    // If no files were exported, throw an error
    if (!result.files || result.files.length === 0) {
      throw new Error('No files were exported. Make sure there is a valid selection.');
    }
    
    // Build result information
    const fileInfo = result.files.map(file => `${file.name} (${file.format})`);
    
    // Return success response
    return {
      content: [
        {
          type: 'text',
          text: `Export completed successfully. Exported ${result.files.length} file(s): ${fileInfo.join(', ')}`
        }
      ],
      data: {
        files: result.files.map(file => ({
          name: file.name,
          format: file.format,
          nodeId: file.nodeId,
          // Include only a preview of the data to avoid huge responses
          dataPreview: file.data.substring(0, 50) + '...'
        }))
      }
    };
  } catch (error) {
    console.error('Error exporting design:', error);
    
    // Return error response
    return {
      content: [
        {
          type: 'text',
          text: `Failed to export design: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
} 