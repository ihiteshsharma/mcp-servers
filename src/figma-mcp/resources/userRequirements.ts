/**
 * User Requirements Resource
 * 
 * This module stores and retrieves user requirements for design projects
 * It acts as a stateful resource that persists between MCP sessions
 */

import { ResourceResult, UserRequirements } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// File path for storing user requirements
const USER_REQUIREMENTS_FILE = path.resolve(process.cwd(), 'user-requirements.json');

// Default empty requirements
const defaultRequirements: UserRequirements = {
  description: '',
  target: '',
  purpose: '',
  keyFeatures: [],
  constraints: [],
  brandGuidelines: {
    colors: [],
    fonts: [],
    style: ''
  }
};

// In-memory cache of the current requirements
let currentRequirements: UserRequirements = { ...defaultRequirements };

/**
 * Initializes the user requirements module
 * Loads requirements from file if available
 */
function initializeRequirements(): void {
  try {
    if (fs.existsSync(USER_REQUIREMENTS_FILE)) {
      const fileContent = fs.readFileSync(USER_REQUIREMENTS_FILE, 'utf-8');
      currentRequirements = JSON.parse(fileContent);
      console.log('Loaded user requirements from file');
    } else {
      console.log('No existing user requirements file found, using defaults');
    }
  } catch (error) {
    console.error('Error loading user requirements:', error);
    console.log('Using default requirements');
  }
}

// Initialize the module
initializeRequirements();

/**
 * Saves the current requirements to disk
 */
function saveRequirements(): void {
  try {
    fs.writeFileSync(
      USER_REQUIREMENTS_FILE,
      JSON.stringify(currentRequirements, null, 2),
      'utf-8'
    );
    console.log('Saved user requirements to file');
  } catch (error) {
    console.error('Error saving user requirements:', error);
  }
}

/**
 * Retrieves the current user requirements
 */
export async function getUserRequirements(): Promise<ResourceResult> {
  console.log('Getting current user requirements');
  
  return {
    contents: [{
      uri: 'user-requirements://current',
      text: JSON.stringify(currentRequirements, null, 2),
      data: currentRequirements
    }]
  };
}

/**
 * Saves user requirements provided by the client
 */
export async function saveUserRequirements(requirements: any): Promise<ResourceResult> {
  console.log('Saving user requirements:', requirements);
  
  // Update the current requirements
  currentRequirements = {
    ...currentRequirements,
    ...requirements
  };
  
  // Save to disk
  saveRequirements();
  
  return {
    contents: [{
      uri: 'user-requirements://current',
      text: JSON.stringify(currentRequirements, null, 2),
      data: currentRequirements
    }]
  };
}

/**
 * Clears the current user requirements back to defaults
 */
export async function clearUserRequirements(): Promise<ResourceResult> {
  console.log('Clearing user requirements');
  
  // Reset to defaults
  currentRequirements = { ...defaultRequirements };
  
  // Save to disk
  saveRequirements();
  
  return {
    contents: [{
      uri: 'user-requirements://current',
      text: JSON.stringify(currentRequirements, null, 2),
      data: currentRequirements
    }]
  };
} 