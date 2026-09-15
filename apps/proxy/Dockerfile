# Build context: repo root (.)
# docker build -f apps/proxy/Dockerfile .

FROM node:20-alpine AS builder
WORKDIR /repo

# Force development environment so tsc and @types are installed during build
ENV NODE_ENV=development

# Install deps scoped ke workspace proxy saja
COPY package*.json ./
COPY apps/proxy/package*.json ./apps/proxy/
RUN npm ci -w apps/proxy --include=dev

# Copy source dan build
COPY apps/proxy/ ./apps/proxy/
RUN cd apps/proxy && npm run build

# Runtime stage — hanya dist + prod deps
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /repo/apps/proxy/dist ./dist
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/proxy/node_modules ./node_modules
COPY --from=builder /repo/apps/proxy/package.json ./

# PORT env diset via Coolify (default 3002 dari kode)
EXPOSE 3002

# node:20-alpine ships without full wget; HEALTHCHECK + Coolify probes need it.
RUN apk add --no-cache wget

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://127.0.0.1:${PORT:-3002}/health || exit 1

CMD ["node", "dist/index.js"]
