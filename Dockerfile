# =====================================================
# Stage 1 - Dependencies
# =====================================================
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci


# =====================================================
# Stage 2 - Builder
# =====================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Reuse dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Future (TypeScript, Prisma, etc.)
# RUN npm run build


# =====================================================
# Stage 3 - Production Runtime
# =====================================================
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache wget

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy only runtime files
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts

# If you have any runtime configuration files later,
# copy them here as well.
# Example:
# COPY --from=builder /app/config ./config

# Run as a non-root user
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

USER nodeuser

EXPOSE 3000



HEALTHCHECK --interval=30s \
             --timeout=5s \
             --start-period=15s \
             --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

CMD ["npm", "start"]