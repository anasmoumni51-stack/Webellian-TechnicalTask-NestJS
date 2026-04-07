# syntax=docker/dockerfile:1
# -------------------------------------------------------------
# BUILD STAGE
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm correctly
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for building)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the NestJS application
RUN pnpm run build

# -------------------------------------------------------------
# PRODUCTION DEPLOYMENT STAGE
# -------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Set NodeJS environment to production automatically
ENV NODE_ENV=production

# Install pnpm correctly
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Only install production dependencies to keep image size small
RUN pnpm install --prod --frozen-lockfile

# Copy the compiled /dist folder from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Security: Don't run Node as root user
USER node

# Expose the application port
EXPOSE 3000

# Start the application using the compiled JavaScript
CMD ["node", "dist/main.js"]
