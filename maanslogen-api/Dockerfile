# maanslogen-api – NestJS + Prisma
# Multi-stage: build → production

FROM node:22-alpine AS base

# --- Build stage ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client genereres under build – læser DATABASE_URL fra .env (kopieres med COPY . .)
# Hvis .env mangler, brug: docker build --build-arg DATABASE_URL=postgresql://...
RUN npx prisma generate

RUN npm run build

# --- Production stage ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

USER nestjs
EXPOSE 9090
ENV PORT=9090

# DATABASE_URL, MINIO_* osv. sættes ved kørsel (env eller docker-compose)
CMD ["node", "dist/main.js"]
