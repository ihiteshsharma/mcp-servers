/**
 * Tests for prompt modules
 */
import { wireframeCreationPrompt, WireframeCreationParams } from '../prompts/wireframeCreation';
import { designRefinementPrompt, DesignRefinementParams } from '../prompts/designRefinement';
import { componentCreationPrompt, ComponentCreationParams } from '../prompts/componentCreation';

describe('Prompts', () => {
  describe('wireframeCreationPrompt', () => {
    it('should generate a prompt with minimal parameters', () => {
      const params: WireframeCreationParams = {
        description: 'A portfolio website for a photographer'
      };
      
      const result = wireframeCreationPrompt(params);
      
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content.type).toBe('text');
      expect(result.messages[0].content.text).toContain('A portfolio website for a photographer');
      expect(result.messages[0].content.text).toContain('The website structure needs to be determined');
      expect(result.messages[0].content.text).toContain('design style should be: minimal');
    });
    
    it('should include pages in the prompt when specified', () => {
      const params: WireframeCreationParams = {
        description: 'A portfolio website for a photographer',
        pages: ['Home', 'Gallery', 'About', 'Contact']
      };
      
      const result = wireframeCreationPrompt(params);
      
      expect(result.messages[0].content.text).toContain('Home, Gallery, About, Contact');
      expect(result.messages[0].content.text).not.toContain('The website structure needs to be determined');
    });
    
    it('should include design style when specified', () => {
      const params: WireframeCreationParams = {
        description: 'A portfolio website for a photographer',
        style: 'dark'
      };
      
      const result = wireframeCreationPrompt(params);
      
      expect(result.messages[0].content.text).toContain('design style should be: dark');
    });
  });
  
  describe('designRefinementPrompt', () => {
    it('should generate a prompt with required parameters', () => {
      const params: DesignRefinementParams = {
        designId: 'design-123',
        feedback: 'The contrast is too low, and the navigation is confusing'
      };
      
      const result = designRefinementPrompt(params);
      
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content.text).toContain('design-123');
      expect(result.messages[0].content.text).toContain('The contrast is too low, and the navigation is confusing');
      expect(result.messages[0].content.text).toContain('Consider all aspects of the design');
    });
    
    it('should include focus areas when specified', () => {
      const params: DesignRefinementParams = {
        designId: 'design-123',
        feedback: 'The contrast is too low, and the navigation is confusing',
        focusAreas: ['Navigation', 'Color contrast']
      };
      
      const result = designRefinementPrompt(params);
      
      expect(result.messages[0].content.text).toContain('Focus on these specific areas: Navigation, Color contrast');
      expect(result.messages[0].content.text).not.toContain('Consider all aspects of the design');
    });
  });
  
  describe('componentCreationPrompt', () => {
    it('should generate a prompt with required parameters', () => {
      const params: ComponentCreationParams = {
        componentType: 'Button',
        properties: {
          variant: 'primary',
          size: 'medium',
          label: 'Submit'
        }
      };
      
      const result = componentCreationPrompt(params);
      
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content.text).toContain('Button');
      expect(result.messages[0].content.text).toContain('properties: variant, size, label');
      expect(result.messages[0].content.text).toContain('variant: primary');
      expect(result.messages[0].content.text).toContain('size: medium');
      expect(result.messages[0].content.text).toContain('label: Submit');
    });
  });
}); 