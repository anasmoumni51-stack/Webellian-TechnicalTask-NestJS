# syntax=docker/dockerfile:1
# -------------------------------------------------------------
# BUILD STAGE
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

#  pnpm latest
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies
RUN pnpm install --frozen-lockfile

#the rest of the application
COPY . .

RUN pnpm run build

# -------------------------------------------------------------
# PRODUCTION DEPLOYMENT STAGE
# -------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production


RUN corepack enable && corepack prepare pnpm@latest --activate


COPY package.json pnpm-lock.yaml ./


RUN pnpm install --prod --frozen-lockfile


COPY --from=builder /usr/src/app/dist ./dist


USER node


EXPOSE 3000


CMD ["node", "dist/main.js"]
