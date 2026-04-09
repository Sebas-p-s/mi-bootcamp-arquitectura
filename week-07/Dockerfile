FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod

# ---- Stage final ----
FROM node:20-alpine AS final

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY src/ ./src/
COPY package.json ./

LABEL org.opencontainers.image.title="Rechum API"
LABEL org.opencontainers.image.description="API REST de gestión de Recursos Humanos — Rechum"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

USER node

CMD ["node", "src/server.js"]
