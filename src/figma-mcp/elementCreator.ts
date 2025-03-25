/**
 * Element Creator Utility
 * 
 * Provides utilities for creating and manipulating Figma elements
 * through the plugin API. This module wraps the low-level plugin
 * communication with more semantic methods for creating UI elements.
 */

import { sendPluginCommand } from './plugin-bridge';

// Element types supported by the creator
export enum ElementType {
  FRAME = 'FRAME',
  TEXT = 'TEXT',
  RECTANGLE = 'RECTANGLE',
  ELLIPSE = 'ELLIPSE',
  IMAGE = 'IMAGE',
  COMPONENT = 'COMPONENT',
  INSTANCE = 'INSTANCE',
  BUTTON = 'BUTTON',
  INPUT = 'INPUT',
  NAVBAR = 'NAVBAR',
  CARD = 'CARD',
  FOOTER = 'FOOTER'
}

// Common properties for all elements
export interface ElementProps {
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fills?: any[];
  strokes?: any[];
  effects?: any[];
  constraints?: {
    horizontal?: 'LEFT' | 'RIGHT' | 'CENTER' | 'SCALE' | 'STRETCH';
    vertical?: 'TOP' | 'BOTTOM' | 'CENTER' | 'SCALE' | 'STRETCH';
  };
}

// Text-specific properties
export interface TextProps extends ElementProps {
  content: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
}

// Button-specific properties
export interface ButtonProps extends ElementProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  cornerRadius?: number;
}

// Input field properties
export interface InputProps extends ElementProps {
  placeholder?: string;
  label?: string;
  variant?: 'default' | 'outlined' | 'filled';
  type?: 'text' | 'email' | 'password' | 'number';
}

// Container properties (for frames, cards, etc.)
export interface ContainerProps extends ElementProps {
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  cornerRadius?: number;
  background?: any;
  layout?: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  itemSpacing?: number;
}

// Navigation bar properties
export interface NavbarProps extends ContainerProps {
  links?: Array<{ text: string; url?: string }>;
  logo?: { src?: string; text?: string };
  position?: 'top' | 'left';
  sticky?: boolean;
}

// Card properties
export interface CardProps extends ContainerProps {
  title?: string;
  description?: string;
  image?: { src?: string };
  actions?: Array<{ text: string; variant?: string }>;
}

// Footer properties
export interface FooterProps extends ContainerProps {
  columns?: Array<{
    title?: string;
    links?: Array<{ text: string; url?: string }>;
  }>;
  copyright?: string;
  logo?: { src?: string; text?: string };
}

// Main element creation functions

/**
 * Creates a text element with the specified properties
 */
export async function createText(parentId: string, props: TextProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.TEXT,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates a button element with the specified properties
 */
export async function createButton(parentId: string, props: ButtonProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.BUTTON,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates an input field with the specified properties
 */
export async function createInput(parentId: string, props: InputProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.INPUT,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates a container (frame) with the specified properties
 */
export async function createContainer(parentId: string, props: ContainerProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.FRAME,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates a navigation bar with the specified properties
 */
export async function createNavbar(parentId: string, props: NavbarProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.NAVBAR,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates a card component with the specified properties
 */
export async function createCard(parentId: string, props: CardProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.CARD,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates a footer with the specified properties
 */
export async function createFooter(parentId: string, props: FooterProps): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.FOOTER,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Creates an image element with the specified properties
 */
export async function createImage(parentId: string, props: ElementProps & { source?: string }): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: ElementType.IMAGE,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Convenience function to create an element of any supported type
 */
export async function createElement(
  parentId: string,
  type: ElementType,
  props: any
): Promise<string> {
  return sendPluginCommand<string>({
    type: 'ADD_ELEMENT',
    payload: {
      elementType: type,
      parent: parentId,
      properties: props
    }
  });
}

/**
 * Applies a style to an existing element
 */
export async function styleElement(elementId: string, styles: any): Promise<void> {
  await sendPluginCommand<void>({
    type: 'STYLE_ELEMENT',
    payload: {
      elementId,
      styles
    }
  });
}

/**
 * Modifies properties of an existing element
 */
export async function modifyElement(elementId: string, properties: any): Promise<void> {
  await sendPluginCommand<void>({
    type: 'MODIFY_ELEMENT',
    payload: {
      elementId,
      modifications: properties
    }
  });
}

/**
 * Arranges children within a container using the specified layout
 */
export async function arrangeLayout(
  containerId: string,
  layoutType: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID',
  properties: any = {}
): Promise<void> {
  await sendPluginCommand<void>({
    type: 'ARRANGE_LAYOUT',
    payload: {
      parentId: containerId,
      layout: layoutType,
      properties
    }
  });
} 