/**
 * Mock for plugin-bridge module
 */

// Mock the plugin bridge functions
export const sendPluginCommand = jest.fn().mockImplementation(async (command) => {
  // Return different mock values based on the command type
  switch (command.type) {
    case 'CREATE_WIREFRAME':
      return {
        wireframeId: 'mock-wireframe-id',
        pageIds: ['mock-page-1', 'mock-page-2', 'mock-page-3']
      };
    
    case 'ADD_ELEMENT':
      return `mock-element-${Date.now()}`;
    
    case 'STYLE_ELEMENT':
      return undefined;
    
    case 'MODIFY_ELEMENT':
      return undefined;
    
    case 'ARRANGE_LAYOUT':
      return undefined;
    
    case 'EXPORT_DESIGN':
      return {
        exportURL: 'https://example.com/export/mock-export.png',
        exportedNodes: command.payload.selection || ['mock-node-1']
      };
    
    case 'GET_SELECTION':
      return [
        { id: 'mock-selection-1', type: 'FRAME', name: 'Mock Frame' },
        { id: 'mock-selection-2', type: 'TEXT', name: 'Mock Text' }
      ];
    
    case 'GET_CURRENT_PAGE':
      return {
        id: 'mock-page-id',
        name: 'Mock Page',
        children: []
      };
    
    default:
      throw new Error(`Unmocked command type: ${command.type}`);
  }
});

export const getCurrentSelection = jest.fn().mockResolvedValue([
  { id: 'mock-selection-1', type: 'FRAME', name: 'Mock Frame' },
  { id: 'mock-selection-2', type: 'TEXT', name: 'Mock Text' }
]);

export const getCurrentPage = jest.fn().mockResolvedValue({
  id: 'mock-page-id',
  name: 'Mock Page',
  children: []
});

// Export other mocked functions
export const getPluginBridge = jest.fn();

export class PluginBridge {
  static getInstance() {
    return {
      initialize: jest.fn().mockResolvedValue(undefined),
      sendCommand: sendPluginCommand,
      shutdown: jest.fn()
    };
  }
}

// Reset all mocks between tests
beforeEach(() => {
  sendPluginCommand.mockClear();
  getCurrentSelection.mockClear();
  getCurrentPage.mockClear();
  getPluginBridge.mockClear();
}); 