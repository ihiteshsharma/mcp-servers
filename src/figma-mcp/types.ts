/**
 * Result type for MCP tools
 */
export interface ToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  data?: any;
  isError?: boolean;
}

/**
 * Result type for MCP resources
 */
export interface ResourceResult {
  contents: Array<{
    uri: string;
    text?: string;
    data?: any;
  }>;
}

/**
 * Design template structure
 */
export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: string;
  tags: string[];
}

/**
 * Component structure
 */
export interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  properties?: Record<string, any>;
}

/**
 * Design system structure
 */
export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  typography: {
    fontFamilies: string[];
    fontSizes: Record<string, number>;
    fontWeights: Record<string, number>;
    lineHeights: Record<string, number | string>;
  };
  spacing: number[];
  borderRadius: number[];
  shadows: any[];
}

/**
 * User requirements structure
 */
export interface UserRequirements {
  description: string;
  target?: string;
  purpose?: string;
  keyFeatures?: string[];
  constraints?: string[];
  brandGuidelines?: {
    colors?: string[];
    fonts?: string[];
    style?: string;
  };
}

/**
 * Prompt result structure
 */
export interface PromptResult {
  messages: Array<{
    role: string;
    content: {
      type: string;
      text: string;
    };
  }>;
} 