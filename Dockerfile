# ============================================
# Stage 1: Build
# Installs ALL deps (including devDeps) to compile
# TypeScript and generate Prisma client
# ============================================
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.15.1

WORKDIR /app

# Copy workspace manifests first (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY apps/backend/package.json ./apps/backend/

# Install ALL dependencies (including devDeps like prisma CLI, @nestjs/cli, typescript)
# --ignore-scripts: prevent postinstall hooks (prisma generate) from running
# before source code is copied. We run prisma generate explicitly after COPY.
RUN pnpm install --frozen-lockfile --no-optional --ignore-scripts

# Copy all source code
COPY . .

# Generate Prisma Client (using the actual schema path)
RUN pnpm --filter @lms/database exec prisma generate

# Build the NestJS backend
RUN pnpm --filter @lms/backend exec nest build

# ============================================
# Stage 2: Production Runner
# Lean image — only runtime artifacts
# ============================================
FROM node:18-alpine AS runner

# Install pnpm (needed for install step)
RUN npm install -g pnpm@8.15.1

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY apps/backend/package.json ./apps/backend/

# Install production dependencies ONLY
# We skip postinstall (prisma generate) because we copy the
# already-generated client from the builder stage below
RUN pnpm install --frozen-lockfile --prod --no-optional --ignore-scripts

# Copy compiled backend dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Copy Prisma schema (needed if prisma client references it at runtime)
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Copy the already-generated Prisma client from builder
# This avoids needing prisma CLI in production
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy workspace package outputs if any
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/packages/database/index.js ./packages/database/index.js
COPY --from=builder /app/packages/database/index.d.ts ./packages/database/index.d.ts

# Expose backend port
EXPOSE 3001

# Set production environment
ENV NODE_ENV=production

# Health check (optional but good practice for Railway)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

# Start the compiled backend
CMD ["node", "apps/backend/dist/main.js"]
