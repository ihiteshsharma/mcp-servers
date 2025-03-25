FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript files
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Set environment variables
ENV NODE_ENV=production

# Expose MCP Server
ENTRYPOINT ["node", "./dist/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthcheck || exit 1

# Documentation
LABEL org.opencontainers.image.title="Figma MCP Server"
LABEL org.opencontainers.image.description="MCP server for creating and manipulating Figma designs"
LABEL org.opencontainers.image.source="https://github.com/your-org/figma-mcp-server"
LABEL org.opencontainers.image.version="0.1.0"
LABEL org.opencontainers.image.licenses="MIT"