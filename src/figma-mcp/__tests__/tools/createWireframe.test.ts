/**
 * Tests for createWireframe tool
 */
// Add Node.js require function
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { createWireframe, CreateWireframeParams } from '../../tools/createWireframe';

// Mock the plugin-bridge module
jest.mock('../../plugin-bridge', () => {
  return require('../mocks/plugin-bridge.mock');
});

// Mock the design systems resource
jest.mock('../../resources/designSystems', () => ({
  getDesignSystem: jest.fn().mockImplementation(async (id) => {
    if (id === 'valid-system') {
      return {
        contents: [
          {
            uri: `design-systems://${id}`,
            data: {
              id,
              name: 'Corporate',
              description: 'Corporate design system',
              colors: { primary: ['#0066cc'] },
              typography: {
                fontFamilies: ['Inter'],
                fontSizes: { md: 16 },
                fontWeights: { regular: 400 },
                lineHeights: { normal: 1.5 }
              },
              spacing: [8, 16],
              borderRadius: [4],
              shadows: []
            }
          }
        ]
      };
    } else {
      return { contents: [] };
    }
  })
}));

describe('createWireframe Tool', () => {
  it('should create a wireframe with minimal parameters', async () => {
    const params: CreateWireframeParams = {
      description: 'A portfolio website for a photographer'
    };
    
    const result = await createWireframe(params);
    
    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain('Wireframe created successfully');
    expect(result.data).toBeDefined();
    expect(result.data.wireframeId).toBe('mock-wireframe-id');
    expect(result.data.pageIds).toHaveLength(3);
  });
  
  it('should use provided pages if specified', async () => {
    const params: CreateWireframeParams = {
      description: 'A portfolio website for a photographer',
      pages: ['Home', 'Portfolio', 'About', 'Contact']
    };
    
    const result = await createWireframe(params);
    
    expect(result.isError).toBeUndefined();
    expect(result.data).toBeDefined();
    
    // Verify that the pages parameter was passed to the plugin
    const { sendPluginCommand } = require('../../plugin-bridge');
    const pluginCall = sendPluginCommand.mock.calls[0][0];
    expect(pluginCall.payload.pages).toEqual(['Home', 'Portfolio', 'About', 'Contact']);
  });
  
  it('should use valid design system if specified', async () => {
    const params: CreateWireframeParams = {
      description: 'A portfolio website for a photographer',
      designSystemId: 'valid-system'
    };
    
    const result = await createWireframe(params);
    
    expect(result.isError).toBeUndefined();
    
    // Verify that the design system was passed to the plugin
    const { sendPluginCommand } = require('../../plugin-bridge');
    const pluginCall = sendPluginCommand.mock.calls[0][0];
    expect(pluginCall.payload.designSystem).toBeDefined();
    expect(pluginCall.payload.designSystem.id).toBe('valid-system');
  });
  
  it('should return error for invalid design system', async () => {
    const params: CreateWireframeParams = {
      description: 'A portfolio website for a photographer',
      designSystemId: 'invalid-system'
    };
    
    const result = await createWireframe(params);
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Failed to create wireframe');
    expect(result.content[0].text).toContain('Design system not found');
  });
  
  it('should handle plugin errors gracefully', async () => {
    // Override the mock to throw an error
    const { sendPluginCommand } = require('../../plugin-bridge');
    sendPluginCommand.mockRejectedValueOnce(new Error('Plugin error'));
    
    const params: CreateWireframeParams = {
      description: 'A portfolio website for a photographer'
    };
    
    const result = await createWireframe(params);
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Failed to create wireframe');
    expect(result.content[0].text).toContain('Plugin error');
  });
}); 