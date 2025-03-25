/**
 * Components Resource
 * 
 * This module provides access to reusable UI components that can be used
 * in design creation and manipulation
 */

import { ResourceResult, Component } from '../types';

// Mock database of UI components
// In a real implementation, these would come from a database or API
const components: Component[] = [
  {
    id: 'button-primary',
    name: 'Primary Button',
    description: 'A primary action button with emphasis styling',
    category: 'buttons',
    properties: {
      variant: 'primary',
      cornerRadius: 8,
      padding: { top: 12, right: 24, bottom: 12, left: 24 }
    }
  },
  {
    id: 'button-secondary',
    name: 'Secondary Button',
    description: 'A secondary action button with less emphasis',
    category: 'buttons',
    properties: {
      variant: 'secondary',
      cornerRadius: 8,
      padding: { top: 12, right: 24, bottom: 12, left: 24 }
    }
  },
  {
    id: 'button-outline',
    name: 'Outline Button',
    description: 'A button with outline styling for tertiary actions',
    category: 'buttons',
    properties: {
      variant: 'outline',
      cornerRadius: 8,
      padding: { top: 12, right: 24, bottom: 12, left: 24 }
    }
  },
  {
    id: 'input-text',
    name: 'Text Input',
    description: 'A standard text input field',
    category: 'inputs',
    properties: {
      type: 'text',
      variant: 'default',
      placeholder: 'Enter text...',
      cornerRadius: 4
    }
  },
  {
    id: 'input-email',
    name: 'Email Input',
    description: 'An input field optimized for email addresses',
    category: 'inputs',
    properties: {
      type: 'email',
      variant: 'default',
      placeholder: 'Enter email...',
      cornerRadius: 4
    }
  },
  {
    id: 'card-basic',
    name: 'Basic Card',
    description: 'A simple card component with flexible content',
    category: 'containers',
    properties: {
      cornerRadius: 8,
      padding: 16,
      shadow: { type: 'DROP_SHADOW', radius: 4, offset: { x: 0, y: 2 } }
    }
  },
  {
    id: 'card-product',
    name: 'Product Card',
    description: 'A card designed for showcasing products with image and details',
    category: 'containers',
    properties: {
      cornerRadius: 8,
      padding: 0,
      shadow: { type: 'DROP_SHADOW', radius: 4, offset: { x: 0, y: 2 } }
    }
  },
  {
    id: 'navbar-simple',
    name: 'Simple Navigation Bar',
    description: 'A simple horizontal navigation bar with logo and links',
    category: 'navigation',
    properties: {
      sticky: true,
      position: 'top',
      links: [
        { text: 'Home' },
        { text: 'About' },
        { text: 'Services' },
        { text: 'Contact' }
      ]
    }
  },
  {
    id: 'footer-basic',
    name: 'Basic Footer',
    description: 'A simple footer with links and copyright information',
    category: 'layout',
    properties: {
      columns: [
        {
          title: 'Company',
          links: [
            { text: 'About Us' },
            { text: 'Contact' },
            { text: 'Careers' }
          ]
        },
        {
          title: 'Legal',
          links: [
            { text: 'Privacy Policy' },
            { text: 'Terms of Service' }
          ]
        }
      ],
      copyright: '© 2023 Company Name. All rights reserved.'
    }
  },
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'A prominent hero section with heading, subheading, and call-to-action',
    category: 'sections',
    properties: {
      layout: 'centered',
      height: 500
    }
  }
];

/**
 * Lists all available UI components
 */
export async function listComponents(): Promise<ResourceResult> {
  console.log('Listing all UI components');
  
  // Format the components for the resource result
  const componentsList = components.map(component => ({
    id: component.id,
    name: component.name,
    description: component.description,
    category: component.category
  }));
  
  return {
    contents: [{
      uri: 'components://list',
      text: JSON.stringify(componentsList, null, 2),
      data: componentsList
    }]
  };
}

/**
 * Gets a specific UI component by ID
 */
export async function getComponent(componentId: string): Promise<ResourceResult> {
  console.log(`Getting component: ${componentId}`);
  
  // Find the component by ID
  const component = components.find(c => c.id === componentId);
  
  if (!component) {
    throw new Error(`Component not found: ${componentId}`);
  }
  
  return {
    contents: [{
      uri: `components://${componentId}`,
      text: JSON.stringify(component, null, 2),
      data: component
    }]
  };
} 