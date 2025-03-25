/**
 * Plugin Bridge for Figma MCP Server
 * 
 * This module handles communication between the MCP server and the Figma plugin.
 * It establishes a communication channel and provides methods for sending
 * commands to the Figma plugin and receiving responses.
 */

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Define message types for plugin communication
export type PluginCommand = 
  | { type: 'CREATE_WIREFRAME', payload: any }
  | { type: 'ADD_ELEMENT', payload: any }
  | { type: 'STYLE_ELEMENT', payload: any }
  | { type: 'MODIFY_ELEMENT', payload: any }
  | { type: 'ARRANGE_LAYOUT', payload: any }
  | { type: 'EXPORT_DESIGN', payload: any }
  | { type: 'GET_SELECTION', payload?: any }
  | { type: 'GET_CURRENT_PAGE', payload?: any };

export type PluginResponse = {
  type: string;
  success: boolean;
  data?: any;
  error?: string;
  id?: string;
};

// Class to manage communication with the Figma plugin
export class PluginBridge {
  private static instance: PluginBridge;
  private pluginProcess: ChildProcess | null = null;
  private responseCallbacks: Map<string, (response: PluginResponse) => void> = new Map();
  private messageBuffer: string = '';
  private messageId: number = 0;
  
  private constructor() {
    // Private constructor for singleton
  }

  // Get singleton instance
  public static getInstance(): PluginBridge {
    if (!PluginBridge.instance) {
      PluginBridge.instance = new PluginBridge();
    }
    return PluginBridge.instance;
  }

  // Initialize the plugin bridge
  public async initialize(): Promise<void> {
    try {
      // Check if Figma CLI is available
      if (!await this.isFigmaCliInstalled()) {
        throw new Error('Figma CLI not found. Please install it with "npm install -g @figma/plugin-cli"');
      }

      // Path to the plugin directory
      const pluginPath = path.resolve(process.cwd(), 'figma-plugin');
      
      // Check if plugin exists
      if (!fs.existsSync(pluginPath)) {
        throw new Error(`Figma plugin directory not found at ${pluginPath}`);
      }

      console.log('Starting Figma plugin process...');
      
      // Start the plugin process (this is a simplification - actual implementation
      // would use Figma's plugin runner mechanism)
      this.pluginProcess = spawn('figma-plugin', ['run', '--dir', pluginPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Set up stdout handler
      this.pluginProcess.stdout?.on('data', (data) => {
        this.handlePluginOutput(data.toString());
      });

      // Set up stderr handler
      this.pluginProcess.stderr?.on('data', (data) => {
        console.error(`Figma plugin error: ${data.toString()}`);
      });

      // Set up exit handler
      this.pluginProcess.on('exit', (code) => {
        console.log(`Figma plugin process exited with code ${code}`);
        this.pluginProcess = null;
      });

      console.log('Figma plugin process started');
      
    } catch (error) {
      console.error('Failed to initialize plugin bridge:', error);
      throw error;
    }
  }

  // Send a command to the Figma plugin
  public async sendCommand<T>(command: PluginCommand): Promise<T> {
    if (!this.pluginProcess) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        // Generate a unique ID for this command
        const id = this.generateId();
        
        // Create a message with the ID
        const message = {
          ...command,
          id
        };

        // Store callback for when response is received
        this.responseCallbacks.set(id, (response) => {
          if (response.success) {
            resolve(response.data as T);
          } else {
            reject(new Error(response.error || 'Unknown error'));
          }
        });

        // Send the message to the plugin
        if (this.pluginProcess?.stdin) {
          this.pluginProcess.stdin.write(JSON.stringify(message) + '\n');
        } else {
          reject(new Error('Plugin process not initialized'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Process output from the plugin
  private handlePluginOutput(data: string): void {
    // Add new data to the buffer
    this.messageBuffer += data;
    
    // Process complete messages (separated by newlines)
    const lines = this.messageBuffer.split('\n');
    
    // Keep the last incomplete line in the buffer
    this.messageBuffer = lines.pop() || '';
    
    // Process each complete line
    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line) as PluginResponse;
          
          // If there's a response ID, call the corresponding callback
          if (response.id && this.responseCallbacks.has(response.id)) {
            const callback = this.responseCallbacks.get(response.id);
            if (callback) {
              callback(response);
              this.responseCallbacks.delete(response.id);
            }
          } else {
            console.log('Received message without callback:', response);
          }
        } catch (error) {
          console.error('Error parsing plugin response:', error, 'Raw data:', line);
        }
      }
    }
  }

  // Generate a unique ID for each command
  private generateId(): string {
    return `cmd_${Date.now()}_${this.messageId++}`;
  }

  // Check if Figma CLI is installed
  private async isFigmaCliInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      const process = spawn('figma-plugin', ['--version'], {
        stdio: 'ignore'
      });
      
      process.on('close', (code) => {
        resolve(code === 0);
      });
    });
  }

  // Clean up resources when shutting down
  public shutdown(): void {
    if (this.pluginProcess) {
      this.pluginProcess.kill();
      this.pluginProcess = null;
    }
  }
}

// Convenience function to get the bridge instance
export function getPluginBridge(): PluginBridge {
  return PluginBridge.getInstance();
}

// Export common utility functions for plugin communication

// Send a command and get the typed response
export async function sendPluginCommand<T>(command: PluginCommand): Promise<T> {
  const bridge = getPluginBridge();
  return bridge.sendCommand<T>(command);
}

// Get the current selection in Figma
export async function getCurrentSelection(): Promise<any[]> {
  return sendPluginCommand<any[]>({ type: 'GET_SELECTION' });
}

// Get the current page in Figma
export async function getCurrentPage(): Promise<any> {
  return sendPluginCommand<any>({ type: 'GET_CURRENT_PAGE' });
} 