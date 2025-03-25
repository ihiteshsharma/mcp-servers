/**
 * Tests for elementCreator utility
 */
import { 
  ElementType, 
  createText, 
  createButton, 
  createInput, 
  createContainer, 
  createNavbar, 
  createCard, 
  createFooter, 
  createImage, 
  createElement, 
  styleElement, 
  modifyElement, 
  arrangeLayout 
} from '../elementCreator';

// Mock the plugin-bridge module
jest.mock('../plugin-bridge', () => {
  const sendPluginCommand = jest.fn().mockImplementation(async (command) => {
    // Return different mock values based on the command type
    switch (command.type) {
      case 'ADD_ELEMENT':
        return `mock-element-${Date.now()}`;
      
      case 'STYLE_ELEMENT':
      case 'MODIFY_ELEMENT':
      case 'ARRANGE_LAYOUT':
        return undefined;
      
      default:
        throw new Error(`Unmocked command type: ${command.type}`);
    }
  });
  
  return {
    sendPluginCommand
  };
});

describe('ElementCreator Utility', () => {
  // Text element creation
  describe('createText', () => {
    it('should create a text element with the specified properties', async () => {
      const parentId = 'parent-id';
      const props = {
        content: 'Hello, World!',
        fontSize: 16,
        fontFamily: 'Inter'
      };
      
      const elementId = await createText(parentId, props);
      
      expect(elementId).toMatch(/^mock-element-/);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('ADD_ELEMENT');
      expect(call.payload.elementType).toBe(ElementType.TEXT);
      expect(call.payload.parent).toBe(parentId);
      expect(call.payload.properties).toEqual(props);
    });
  });
  
  // Button element creation
  describe('createButton', () => {
    it('should create a button element with the specified properties', async () => {
      const parentId = 'parent-id';
      const props = {
        text: 'Click Me',
        variant: 'primary',
        cornerRadius: 8
      };
      
      const elementId = await createButton(parentId, props);
      
      expect(elementId).toMatch(/^mock-element-/);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('ADD_ELEMENT');
      expect(call.payload.elementType).toBe(ElementType.BUTTON);
      expect(call.payload.parent).toBe(parentId);
      expect(call.payload.properties).toEqual(props);
    });
  });
  
  // Container element creation
  describe('createContainer', () => {
    it('should create a container element with the specified properties', async () => {
      const parentId = 'parent-id';
      const props = {
        width: 400,
        height: 300,
        padding: 16,
        cornerRadius: 8,
        layout: 'VERTICAL'
      };
      
      const elementId = await createContainer(parentId, props);
      
      expect(elementId).toMatch(/^mock-element-/);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('ADD_ELEMENT');
      expect(call.payload.elementType).toBe(ElementType.FRAME);
      expect(call.payload.parent).toBe(parentId);
      expect(call.payload.properties).toEqual(props);
    });
  });
  
  // Generic element creation
  describe('createElement', () => {
    it('should create an element of the specified type', async () => {
      const parentId = 'parent-id';
      const type = ElementType.CARD;
      const props = {
        title: 'Card Title',
        description: 'Card description'
      };
      
      const elementId = await createElement(parentId, type, props);
      
      expect(elementId).toMatch(/^mock-element-/);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('ADD_ELEMENT');
      expect(call.payload.elementType).toBe(type);
      expect(call.payload.parent).toBe(parentId);
      expect(call.payload.properties).toEqual(props);
    });
  });
  
  // Element styling
  describe('styleElement', () => {
    it('should style an element with the specified styles', async () => {
      const elementId = 'element-id';
      const styles = {
        fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }],
        effects: [{ type: 'DROP_SHADOW', radius: 4 }]
      };
      
      await styleElement(elementId, styles);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('STYLE_ELEMENT');
      expect(call.payload.elementId).toBe(elementId);
      expect(call.payload.styles).toEqual(styles);
    });
  });
  
  // Element modification
  describe('modifyElement', () => {
    it('should modify an element with the specified properties', async () => {
      const elementId = 'element-id';
      const properties = {
        x: 100,
        y: 200,
        width: 400,
        height: 300
      };
      
      await modifyElement(elementId, properties);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('MODIFY_ELEMENT');
      expect(call.payload.elementId).toBe(elementId);
      expect(call.payload.modifications).toEqual(properties);
    });
  });
  
  // Layout arrangement
  describe('arrangeLayout', () => {
    it('should arrange layout with the specified properties', async () => {
      const containerId = 'container-id';
      const layoutType = 'VERTICAL';
      const properties = {
        spacing: 16,
        padding: 24,
        alignment: 'CENTER'
      };
      
      await arrangeLayout(containerId, layoutType, properties);
      
      // Check that sendPluginCommand was called with the right parameters
      const { sendPluginCommand } = require('../plugin-bridge');
      const call = sendPluginCommand.mock.calls[0][0];
      
      expect(call.type).toBe('ARRANGE_LAYOUT');
      expect(call.payload.parentId).toBe(containerId);
      expect(call.payload.layout).toBe(layoutType);
      expect(call.payload.properties).toEqual(properties);
    });
  });
}); 