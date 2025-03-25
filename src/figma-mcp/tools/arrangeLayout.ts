/**
 * Arrange Layout Tool
 * 
 * This tool arranges elements within a container using different layout algorithms
 * It supports flex (horizontal/vertical), grid, and auto layouts
 */

import { arrangeLayout as applyLayout } from '../elementCreator';
import { ToolResult } from '../types';

export interface ArrangeLayoutParams {
  parentId: string;
  layout: 'flex' | 'grid' | 'auto';
  properties?: {
    // Flex layout properties
    direction?: 'horizontal' | 'vertical';
    alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
    wrap?: boolean;
    gap?: number | { row?: number; column?: number };
    
    // Grid layout properties
    columns?: number;
    rows?: number;
    columnGap?: number;
    rowGap?: number;
    autoColumns?: string;
    autoRows?: string;
    
    // Auto layout specific properties
    padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
    itemSpacing?: number;
    resizing?: 'hug' | 'fixed' | 'fill';
    
    // Common layout properties
    alignment?: {
      horizontal?: 'left' | 'center' | 'right' | 'stretch';
      vertical?: 'top' | 'center' | 'bottom' | 'stretch';
    };
    distribution?: 'packed' | 'space-between' | 'space-around' | 'space-evenly';
  };
}

/**
 * Maps layout types from MCP to Figma layout types
 */
function mapLayoutType(layout: string): 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID' {
  const layoutMap: Record<string, 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID'> = {
    'auto': 'NONE',
    'flex': 'HORIZONTAL', // Default to horizontal, will be updated based on direction
    'grid': 'GRID'
  };
  
  return layoutMap[layout] || 'NONE';
}

/**
 * Prepares layout properties based on the layout type and properties
 */
function prepareLayoutProperties(
  layout: string,
  properties?: ArrangeLayoutParams['properties']
): any {
  if (!properties) return {};
  
  const result: any = {};
  
  // Handle direction for flex layouts
  if (layout === 'flex' && properties.direction === 'vertical') {
    result.layoutMode = 'VERTICAL';
  } else if (layout === 'flex') {
    result.layoutMode = 'HORIZONTAL';
  }
  
  // Map common properties
  if (properties.gap !== undefined) {
    if (typeof properties.gap === 'number') {
      result.itemSpacing = properties.gap;
    } else if (properties.gap) {
      // For grid layouts, map row/column gaps
      if (layout === 'grid') {
        if (properties.gap.row !== undefined) result.rowGap = properties.gap.row;
        if (properties.gap.column !== undefined) result.columnGap = properties.gap.column;
      }
    }
  }
  
  // Map grid specific properties
  if (layout === 'grid') {
    if (properties.columns !== undefined) result.gridColumns = properties.columns;
    if (properties.rows !== undefined) result.gridRows = properties.rows;
    if (properties.columnGap !== undefined) result.columnGap = properties.columnGap;
    if (properties.rowGap !== undefined) result.rowGap = properties.rowGap;
  }
  
  // Map padding
  if (properties.padding !== undefined) {
    if (typeof properties.padding === 'number') {
      result.paddingLeft = properties.padding;
      result.paddingRight = properties.padding;
      result.paddingTop = properties.padding;
      result.paddingBottom = properties.padding;
    } else if (properties.padding) {
      if (properties.padding.left !== undefined) result.paddingLeft = properties.padding.left;
      if (properties.padding.right !== undefined) result.paddingRight = properties.padding.right;
      if (properties.padding.top !== undefined) result.paddingTop = properties.padding.top;
      if (properties.padding.bottom !== undefined) result.paddingBottom = properties.padding.bottom;
    }
  }
  
  // Map alignment properties
  if (properties.alignment) {
    if (typeof properties.alignment === 'string') {
      switch (properties.alignment) {
        case 'start':
          result.primaryAxisAlignItems = 'MIN';
          break;
        case 'center':
          result.primaryAxisAlignItems = 'CENTER';
          break;
        case 'end':
          result.primaryAxisAlignItems = 'MAX';
          break;
        case 'space-between':
          result.primaryAxisAlignItems = 'SPACE_BETWEEN';
          break;
      }
    } else if (properties.alignment) {
      // Handle object-style alignment
      if (properties.alignment.horizontal) {
        switch (properties.alignment.horizontal) {
          case 'left':
            result.counterAxisAlignItems = 'MIN';
            break;
          case 'center':
            result.counterAxisAlignItems = 'CENTER';
            break;
          case 'right':
            result.counterAxisAlignItems = 'MAX';
            break;
          case 'stretch':
            result.counterAxisAlignItems = 'STRETCH';
            break;
        }
      }
      
      if (properties.alignment.vertical) {
        // For vertical layouts, the vertical alignment maps to primary axis
        if (result.layoutMode === 'VERTICAL') {
          switch (properties.alignment.vertical) {
            case 'top':
              result.primaryAxisAlignItems = 'MIN';
              break;
            case 'center':
              result.primaryAxisAlignItems = 'CENTER';
              break;
            case 'bottom':
              result.primaryAxisAlignItems = 'MAX';
              break;
            case 'stretch':
              result.primaryAxisAlignItems = 'SPACE_BETWEEN';
              break;
          }
        } else {
          // For horizontal layouts, vertical alignment maps to counter axis
          switch (properties.alignment.vertical) {
            case 'top':
              result.counterAxisAlignItems = 'MIN';
              break;
            case 'center':
              result.counterAxisAlignItems = 'CENTER';
              break;
            case 'bottom':
              result.counterAxisAlignItems = 'MAX';
              break;
            case 'stretch':
              result.counterAxisAlignItems = 'STRETCH';
              break;
          }
        }
      }
    }
  }
  
  return result;
}

/**
 * Arranges elements within a container using the specified layout algorithm
 */
export async function arrangeLayout(params: ArrangeLayoutParams): Promise<ToolResult> {
  try {
    console.log(`Arranging layout for container: ${params.parentId} with layout: ${params.layout}`);
    
    // Map layout type and prepare properties
    const layoutType = mapLayoutType(params.layout);
    const layoutProperties = prepareLayoutProperties(params.layout, params.properties);
    
    // Apply the layout
    await applyLayout(params.parentId, layoutType, layoutProperties);
    
    // Return success response
    return {
      content: [
        {
          type: 'text',
          text: `Layout applied successfully to container ${params.parentId}`
        }
      ],
      data: {
        containerId: params.parentId,
        layout: params.layout,
        appliedProperties: Object.keys(layoutProperties)
      }
    };
  } catch (error) {
    console.error('Error arranging layout:', error);
    
    // Return error response
    return {
      content: [
        {
          type: 'text',
          text: `Failed to arrange layout: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
} 