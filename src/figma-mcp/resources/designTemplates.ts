/**
 * Design Templates Resource
 * 
 * This module provides access to website design templates that can be used
 * as starting points for creating new designs
 */

import { ResourceResult, DesignTemplate } from '../types';

// Mock database of design templates
// In a real implementation, these might come from a database or API
const templates: DesignTemplate[] = [
  {
    id: 'landing-page-basic',
    name: 'Basic Landing Page',
    description: 'A clean, minimalist landing page template with hero section, features, and call-to-action',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['landing-page', 'minimal', 'marketing']
  },
  {
    id: 'portfolio-professional',
    name: 'Professional Portfolio',
    description: 'A portfolio template for creative professionals with project showcase and contact form',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['portfolio', 'professional', 'creative']
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'A complete e-commerce template with product grid, cart, and checkout flow',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['ecommerce', 'shop', 'retail']
  },
  {
    id: 'blog-standard',
    name: 'Standard Blog',
    description: 'A blog template with article listings, categories, and detailed post views',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['blog', 'content', 'articles']
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    description: 'A template for showcasing software-as-a-service products with pricing and features',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['saas', 'product', 'software']
  },
  {
    id: 'corporate-business',
    name: 'Corporate Business',
    description: 'A professional template for corporate websites with about, services, and team sections',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['corporate', 'business', 'professional']
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Showcase',
    description: 'A template designed to showcase mobile applications with app store links and features',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['mobile', 'app', 'showcase']
  },
  {
    id: 'restaurant-cafe',
    name: 'Restaurant/Cafe',
    description: 'A template for restaurants and cafes with menu, reservations, and location information',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXy8vJkA4prAAAAH0lEQVR4AWMAgVEwCkbBKBgFo2AUjIJRMApGwUADAACUaQABaYrkUAAAAABJRU5ErkJggg==',
    category: 'website',
    tags: ['restaurant', 'cafe', 'food']
  }
];

/**
 * Lists all available design templates
 */
export async function listDesignTemplates(): Promise<ResourceResult> {
  console.log('Listing all design templates');
  
  // Format the templates for the resource result
  const templatesList = templates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags
  }));
  
  return {
    contents: [{
      uri: 'design-templates://list',
      text: JSON.stringify(templatesList, null, 2),
      data: templatesList
    }]
  };
}

/**
 * Gets a specific design template by ID
 */
export async function getDesignTemplate(templateId: string): Promise<ResourceResult> {
  console.log(`Getting design template: ${templateId}`);
  
  // Find the template by ID
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error(`Design template not found: ${templateId}`);
  }
  
  return {
    contents: [{
      uri: `design-templates://${templateId}`,
      text: JSON.stringify(template, null, 2),
      data: template
    }]
  };
} 