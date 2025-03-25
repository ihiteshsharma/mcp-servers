/**
 * Wireframe Creation Prompt
 * 
 * This module provides a prompt that guides LLMs through the process of
 * creating wireframes based on user requirements
 */

import { PromptResult } from '../types';

export interface WireframeCreationParams {
  description: string;
  pages?: string[];
  style?: string;
}

/**
 * Creates a prompt to guide the LLM in creating a wireframe
 */
export function wireframeCreationPrompt(params: WireframeCreationParams): PromptResult {
  const { description, pages = [], style = 'minimal' } = params;
  
  // Format the pages list for the prompt
  const pagesText = pages.length > 0
    ? `The website should include the following pages: ${pages.join(', ')}.`
    : 'The website structure needs to be determined based on the requirements.';
  
  // Create the prompt text
  const promptText = `
I need your help creating a wireframe for a website with the following description:

"${description}"

${pagesText}

The design style should be: ${style}.

Please help me create this wireframe by following these steps:

1. First, analyze the description and identify the key requirements and goals of the website.

2. Based on the description, recommend a site structure with:
   - Essential pages to include
   - Key sections for each page
   - Navigation structure
   - Content hierarchy

3. For the wireframe layout, consider:
   - Appropriate layout (single page, multi-page)
   - Responsive design considerations
   - Key UI components needed
   - User flow through the site

4. Recommend specific UI elements that would enhance the user experience:
   - Navigation patterns (horizontal nav, sidebar, hamburger menu)
   - Hero section design
   - Content organization (cards, lists, grids)
   - Call-to-action placement and design

5. Provide your recommendations in a structured format that I can use to create the wireframe.

You can use the following tools to implement the wireframe:
- create-wireframe: Generate the initial wireframe structure
- add-element: Add specific UI elements to the design
- style-element: Apply styling to elements
- arrange-layout: Organize elements within containers

I'm using Figma for this design, so focus on elements and patterns that work well in Figma.
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