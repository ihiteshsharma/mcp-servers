/**
 * Component Creation Prompt
 * 
 * This module provides a prompt that guides LLMs through the process of
 * creating UI components for designs
 */

import { PromptResult } from '../types';

export interface ComponentCreationParams {
  componentType: string;
  properties: Record<string, any>;
}

/**
 * Creates a prompt to guide the LLM in creating a UI component
 */
export function componentCreationPrompt(params: ComponentCreationParams): PromptResult {
  const { componentType, properties } = params;
  
  // Format the properties for the prompt
  const propertiesText = Object.entries(properties)
    .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
    .join('\n');
  
  // Create the prompt text
  const promptText = `
I need your help creating a ${componentType} UI component with the following properties:

${propertiesText}

Please help me design this component by following these steps:

1. First, analyze the component type and required properties to understand what we're creating.

2. Suggest an appropriate structure for this component, including:
   - Base elements needed (container, text fields, buttons, etc.)
   - Layout arrangement of these elements
   - Proper hierarchy and spacing

3. For each property specified, explain:
   - How it should be applied to the component
   - Which element should receive this property
   - Any default values for properties not specified

4. Consider these design best practices:
   - Visual consistency with standard UI patterns
   - Accessibility requirements
   - Responsiveness
   - States (hover, focus, active, disabled)

5. Provide your recommendations in a structured format that I can implement.

You can use the following tools to implement the component:
- add-element: Create the base elements needed
- style-element: Apply styling to elements
- arrange-layout: Organize elements within containers
- modify-element: Adjust properties as needed

I'm looking for a professional, well-designed component that follows UI/UX best practices and could be reused across the design.
  `;
  
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: promptText.trim()
        }
      }
    ]
  };
} 