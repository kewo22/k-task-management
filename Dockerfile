# Stage 1: Building the code
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Set permissions for security (optional but recommended)
RUN chown -R node:node /usr/src/app
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
