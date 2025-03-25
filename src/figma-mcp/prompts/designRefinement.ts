/**
 * Design Refinement Prompt
 * 
 * This module provides a prompt that guides LLMs through the process of
 * refining and improving existing designs based on feedback
 */

import { PromptResult } from '../types';

export interface DesignRefinementParams {
  designId: string;
  feedback: string;
  focusAreas?: string[];
}

/**
 * Creates a prompt to guide the LLM in refining an existing design
 */
export function designRefinementPrompt(params: DesignRefinementParams): PromptResult {
  const { designId, feedback, focusAreas = [] } = params;
  
  // Format the focus areas for the prompt
  const focusAreasText = focusAreas.length > 0
    ? `Focus particularly on these areas: ${focusAreas.join(', ')}.`
    : 'Consider all aspects of the design that could be improved.';
  
  // Create the prompt text
  const promptText = `
I need your help refining an existing website design with the ID: ${designId}.

I've received the following feedback that needs to be addressed:

"${feedback}"

${focusAreasText}

Please help me refine this design by following these steps:

1. First, analyze the feedback to identify the key issues and improvement opportunities.

2. For each issue identified, suggest specific changes:
   - What element or section needs to be modified
   - What specific changes should be made
   - Why this change will address the feedback
   - How it will improve the overall design

3. Consider these design principles in your recommendations:
   - Visual hierarchy and emphasis
   - Balance and alignment
   - Consistency and rhythm
   - Accessibility and usability
   - Responsive design considerations

4. Prioritize your recommendations based on:
   - Impact on user experience
   - Difficulty of implementation
   - Alignment with the original design intent

5. Provide your recommendations in a structured format that I can implement.

You can use the following tools to implement the refinements:
- modify-element: Change properties of existing elements
- style-element: Update the styling of elements
- add-element: Add new elements if needed
- arrange-layout: Adjust the organization of elements

I'm looking for practical, implementation-ready suggestions that will elevate the design while addressing the specific feedback.
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