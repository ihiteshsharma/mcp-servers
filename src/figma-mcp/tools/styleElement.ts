/**
 * Style Element Tool
 * 
 * This tool applies styling to an existing element in Figma
 * It handles various style properties for different types of elements
 */

import { styleElement as applyStyle } from '../elementCreator';
import { ToolResult } from '../types';

export interface StyleElementParams {
  elementId: string;
  styles: {
    fill?: {
      type?: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
      color?: string; // Hex color code
      opacity?: number;
      gradientStops?: Array<{ position: number; color: string }>;
    }[];
    stroke?: {
      type?: 'SOLID';
      color?: string;
      opacity?: number;
      weight?: number;
    }[];
    effect?: {
      type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
      radius?: number;
      color?: string;
      offset?: { x: number; y: number };
    }[];
    cornerRadius?: number | { topLeft?: number; topRight?: number; bottomRight?: number; bottomLeft?: number };
    typography?: {
      fontFamily?: string;
      fontWeight?: number;
      fontSize?: number;
      letterSpacing?: number;
      lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
      textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
      textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
      textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
      textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
    };
    // Layout properties
    layoutAlign?: 'STRETCH' | 'INHERIT';
    layoutGrow?: number;
    layoutPositioning?: 'AUTO' | 'ABSOLUTE';
    itemSpacing?: number;
    // Constraints
    constraints?: {
      horizontal?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
      vertical?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
    };
    // Visual style properties
    opacity?: number;
    blendMode?: 'NORMAL' | 'MULTIPLY' | 'SCREEN' | 'OVERLAY' | 'DARKEN' | 'LIGHTEN' | 'COLOR_DODGE' | 'COLOR_BURN' | 'HARD_LIGHT' | 'SOFT_LIGHT' | 'DIFFERENCE' | 'EXCLUSION' | 'HUE' | 'SATURATION' | 'COLOR' | 'LUMINOSITY';
    visible?: boolean;
    [key: string]: any; // Allow for additional properties
  };
}

/**
 * Applies styling to an existing element based on the provided style parameters
 */
export async function styleElement(params: StyleElementParams): Promise<ToolResult> {
  try {
    console.log(`Styling element: ${params.elementId}`);
    
    // Apply the styles to the element
    await applyStyle(params.elementId, params.styles);
    
    // Return success response
    return {
      content: [
        {
          type: 'text',
          text: `Element ${params.elementId} styled successfully`
        }
      ],
      data: {
        elementId: params.elementId,
        appliedStyles: Object.keys(params.styles)
      }
    };
  } catch (error) {
    console.error('Error styling element:', error);
    
    // Return error response
    return {
      content: [
        {
          type: 'text',
          text: `Failed to style element: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
} 