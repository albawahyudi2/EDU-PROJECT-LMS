# ============================================
# Stage 1: Build
# ============================================
FROM node:18-alpine AS builder

# Install OpenSSL (required by Prisma on Alpine)
RUN apk add --no-cache openssl

# Install pnpm
RUN npm install -g pnpm@8.15.1

WORKDIR /app

# Copy workspace manifests + .npmrc first (for layer caching)
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY apps/backend/package.json ./apps/backend/

# Copy prisma schema BEFORE install so backend postinstall hook can find it
COPY packages/database/prisma/schema.prisma ./packages/database/prisma/schema.prisma

# Install ALL dependencies (postinstall hooks will work because schema exists)
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Generate Prisma Client explicitly
RUN pnpm --filter @lms/database exec prisma generate

# Build the NestJS backend
RUN pnpm --filter @lms/backend exec nest build

# ============================================
# Stage 2: Production Runner
# ============================================
FROM node:18-alpine AS runner

# Install OpenSSL (required by Prisma on Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package manifests (needed for node module resolution)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/types/package.json ./packages/types/
COPY --from=builder /app/apps/backend/package.json ./apps/backend/

# Copy node_modules from builder (includes properly generated Prisma client)
# pnpm uses symlinks internally — copying from builder preserves the real files
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled backend dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Copy Prisma schema (needed at runtime)
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Copy workspace package outputs
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/packages/database/index.js ./packages/database/index.js
COPY --from=builder /app/packages/database/index.d.ts ./packages/database/index.d.ts

# Recreate workspace package symlinks that break during Docker COPY
# (pnpm symlinks point outside node_modules/ to ../../packages/)
RUN mkdir -p node_modules/@lms && \
    rm -rf node_modules/@lms/database node_modules/@lms/types && \
    ln -s ../../packages/database node_modules/@lms/database && \
    ln -s ../../packages/types node_modules/@lms/types

# Expose backend port
EXPOSE 3001

# Set production environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "apps/backend/dist/main.js"]
