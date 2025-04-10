# Build stage
FROM node:20.11.1 AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Copy package files
COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code and public files
COPY src/ ./src/
COPY public/ ./public/

# Build the application
RUN npm run build && ls -la

# Development stage
FROM node:20.11.1 AS development
LABEL project="bellecolleenv2"

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Create necessary directories and set permissions
RUN mkdir -p .next node_modules public && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Copy package files and dependencies
COPY --chown=node:node package*.json ./
RUN npm install

# Copy source code and public files
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node next.config.js ./
COPY --chown=node:node tsconfig.json ./

# Create next-env.d.ts with proper permissions
RUN touch next-env.d.ts && \
    chmod 644 next-env.d.ts

EXPOSE 3000

# Use nodemon for better development experience
RUN mkdir -p ~/.npm-global && \
    npm config set prefix '~/.npm-global' && \
    npm install -g nodemon

# Add npm global bin to PATH
ENV PATH=~/.npm-global/bin:$PATH

# Mount points for volumes
VOLUME ["/app/public", "/app/src"]

CMD ["npm", "run", "dev"]

# Production stage
FROM nginx:stable
LABEL project="bellecolleenv2"

# Copy the built static files from builder stage
COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
