/**
 * Tests for types module
 */
import { 
  ToolResult, 
  ResourceResult, 
  DesignTemplate, 
  Component, 
  DesignSystem, 
  UserRequirements, 
  PromptResult 
} from '../types';

describe('Types Module', () => {
  describe('ToolResult', () => {
    it('should create a valid tool result', () => {
      const result: ToolResult = {
        content: [
          { type: 'text', text: 'Test content' }
        ]
      };
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe('Test content');
      expect(result.isError).toBeUndefined();
    });
    
    it('should create an error tool result', () => {
      const errorResult: ToolResult = {
        content: [
          { type: 'text', text: 'Error message' }
        ],
        isError: true
      };
      
      expect(errorResult.content).toHaveLength(1);
      expect(errorResult.isError).toBe(true);
    });
  });
  
  describe('ResourceResult', () => {
    it('should create a valid resource result', () => {
      const result: ResourceResult = {
        contents: [
          { uri: 'test://uri', text: 'Test resource' }
        ]
      };
      
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('test://uri');
      expect(result.contents[0].text).toBe('Test resource');
    });
    
    it('should create a resource result with data', () => {
      const data = { id: '123', name: 'Test' };
      const result: ResourceResult = {
        contents: [
          { uri: 'test://uri', data }
        ]
      };
      
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].data).toEqual(data);
    });
  });
  
  describe('DesignTemplate', () => {
    it('should create a valid design template', () => {
      const template: DesignTemplate = {
        id: 'template-1',
        name: 'Landing Page',
        description: 'A modern landing page template',
        category: 'website',
        tags: ['landing', 'marketing']
      };
      
      expect(template.id).toBe('template-1');
      expect(template.name).toBe('Landing Page');
      expect(template.tags).toContain('landing');
    });
  });
  
  describe('Component', () => {
    it('should create a valid component', () => {
      const component: Component = {
        id: 'component-1',
        name: 'Button',
        description: 'A reusable button component',
        category: 'ui',
        properties: {
          variant: 'primary',
          size: 'medium'
        }
      };
      
      expect(component.id).toBe('component-1');
      expect(component.name).toBe('Button');
      expect(component.properties?.variant).toBe('primary');
    });
  });
  
  describe('DesignSystem', () => {
    it('should create a valid design system', () => {
      const designSystem: DesignSystem = {
        id: 'system-1',
        name: 'Corporate',
        description: 'Corporate design system',
        colors: {
          primary: ['#0066cc', '#004080'],
          secondary: ['#e6f2ff'],
          accent: ['#ff6600'],
          neutral: ['#f5f5f5', '#e0e0e0', '#9e9e9e', '#212121'],
          semantic: {
            success: '#00cc66',
            warning: '#ffcc00',
            error: '#ff3300',
            info: '#0099ff'
          }
        },
        typography: {
          fontFamilies: ['Inter', 'Roboto'],
          fontSizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24
          },
          fontWeights: {
            regular: 400,
            medium: 500,
            bold: 700
          },
          lineHeights: {
            tight: 1.2,
            normal: 1.5,
            loose: 1.8
          }
        },
        spacing: [4, 8, 16, 24, 32, 48],
        borderRadius: [0, 4, 8, 16, 24],
        shadows: [
          { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0,0,0,0.1)' }
        ]
      };
      
      expect(designSystem.id).toBe('system-1');
      expect(designSystem.colors.primary).toHaveLength(2);
      expect(designSystem.typography.fontFamilies).toContain('Inter');
      expect(designSystem.spacing).toHaveLength(6);
    });
  });
  
  describe('UserRequirements', () => {
    it('should create valid user requirements', () => {
      const requirements: UserRequirements = {
        description: 'E-commerce website for selling handmade jewelry',
        target: 'Women aged 25-45',
        purpose: 'Showcase and sell unique handmade jewelry pieces',
        keyFeatures: ['Product catalog', 'Shopping cart', 'User accounts'],
        constraints: ['Mobile-friendly', 'Fast loading'],
        brandGuidelines: {
          colors: ['#f5d6c6', '#d2a68e', '#8e7760'],
          fonts: ['Playfair Display', 'Raleway'],
          style: 'Elegant and minimalistic'
        }
      };
      
      expect(requirements.description).toBe('E-commerce website for selling handmade jewelry');
      expect(requirements.keyFeatures).toContain('Shopping cart');
      expect(requirements.brandGuidelines?.colors).toHaveLength(3);
    });
  });
  
  describe('PromptResult', () => {
    it('should create a valid prompt result', () => {
      const result: PromptResult = {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'Design a landing page'
            }
          }
        ]
      };
      
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content.text).toBe('Design a landing page');
    });
  });
}); 