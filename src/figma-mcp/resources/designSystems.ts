/**
 * Design Systems Resource
 * 
 * This module provides access to design systems with color schemes,
 * typography, spacing, and other design tokens for consistent styling
 */

import { ResourceResult, DesignSystem } from '../types';

// Mock database of design systems
// In a real implementation, these would come from a database or API
const designSystems: DesignSystem[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'A clean, minimal design system with a focus on typography and whitespace',
    colors: {
      primary: ['#3B82F6', '#2563EB', '#1D4ED8'],
      secondary: ['#10B981', '#059669', '#047857'],
      accent: ['#F59E0B', '#D97706', '#B45309'],
      neutral: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'],
      semantic: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      }
    },
    typography: {
      fontFamilies: ['Inter', 'Roboto', 'sans-serif'],
      fontSizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      }
    },
    spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256],
    borderRadius: [0, 2, 4, 6, 8, 12, 16, 24, 32],
    shadows: [
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 1 }, radius: 2 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 2 }, radius: 4 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 4 }, radius: 6 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 8 }, radius: 10 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 16 }, radius: 24 }
    ]
  },
  {
    id: 'corporate-business',
    name: 'Corporate Business',
    description: 'A professional design system suited for corporate and business websites',
    colors: {
      primary: ['#1E40AF', '#1E3A8A', '#172554'],
      secondary: ['#0F766E', '#115E59', '#134E4A'],
      accent: ['#9333EA', '#7E22CE', '#6B21A8'],
      neutral: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'],
      semantic: {
        success: '#15803D',
        warning: '#B45309',
        error: '#B91C1C',
        info: '#1E40AF'
      }
    },
    typography: {
      fontFamilies: ['Montserrat', 'Open Sans', 'sans-serif'],
      fontSizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      }
    },
    spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256],
    borderRadius: [0, 2, 4, 6, 8, 12, 16],
    shadows: [
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 1 }, radius: 2 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 2 }, radius: 4 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 4 }, radius: 6 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.1)', offset: { x: 0, y: 8 }, radius: 10 }
    ]
  },
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    description: 'A bold and expressive design system for creative websites and applications',
    colors: {
      primary: ['#EC4899', '#DB2777', '#BE185D'],
      secondary: ['#8B5CF6', '#7C3AED', '#6D28D9'],
      accent: ['#F97316', '#EA580C', '#C2410C'],
      neutral: ['#FAFAFA', '#F4F4F5', '#E4E4E7', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#27272A', '#18181B'],
      semantic: {
        success: '#16A34A',
        warning: '#EAB308',
        error: '#DC2626',
        info: '#2563EB'
      }
    },
    typography: {
      fontFamilies: ['Poppins', 'Playfair Display', 'sans-serif'],
      fontSizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
        '6xl': 64
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      }
    },
    spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256],
    borderRadius: [0, 4, 8, 12, 16, 24, 32, 9999],
    shadows: [
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.2)', offset: { x: 0, y: 2 }, radius: 4 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.2)', offset: { x: 0, y: 4 }, radius: 8 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.2)', offset: { x: 0, y: 8 }, radius: 16 },
      { type: 'DROP_SHADOW', color: 'rgba(0, 0, 0, 0.2)', offset: { x: 0, y: 16 }, radius: 24 }
    ]
  }
];

/**
 * Lists all available design systems
 */
export async function listDesignSystems(): Promise<ResourceResult> {
  console.log('Listing all design systems');
  
  // Format the design systems for the resource result
  const designSystemsList = designSystems.map(system => ({
    id: system.id,
    name: system.name,
    description: system.description
  }));
  
  return {
    contents: [{
      uri: 'design-systems://list',
      text: JSON.stringify(designSystemsList, null, 2),
      data: designSystemsList
    }]
  };
}

/**
 * Gets a specific design system by ID
 */
export async function getDesignSystem(systemId: string): Promise<ResourceResult> {
  console.log(`Getting design system: ${systemId}`);
  
  // Find the design system by ID
  const designSystem = designSystems.find(ds => ds.id === systemId);
  
  if (!designSystem) {
    throw new Error(`Design system not found: ${systemId}`);
  }
  
  return {
    contents: [{
      uri: `design-systems://${systemId}`,
      text: JSON.stringify(designSystem, null, 2),
      data: designSystem
    }]
  };
} 