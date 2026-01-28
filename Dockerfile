# ============================================
# DOCKERFILE SIN DESCARGAS EXTERNAS
# ============================================
# Evita descargar Google Fonts y otros recursos externos

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# ============================================
# Stage 1: Dependencies
# ============================================
FROM base AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --prefer-offline \
    --no-audit \
    --legacy-peer-deps \
    --no-fund \
    --ignore-scripts

# ============================================
# Stage 2: Build (SIN DESCARGAS EXTERNAS)
# ============================================
FROM base AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# VARIABLES CRÍTICAS para evitar descargas en build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# TIMEOUT MÁS LARGO para npm (evita timeouts)
ENV npm_config_fetch_timeout=120000
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000

# SKIP optimizaciones que requieren internet
ENV NEXT_SKIP_ENV_VALIDATION=true
ENV SKIP_ENV_VALIDATION=true

# Asegurar que el directorio public existe
RUN mkdir -p /app/public

# Build sin descargas innecesarias
RUN npm run build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM base AS runtime
WORKDIR /app

# Environment variables para runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Variables de Supabase inyectadas por Dokploy en runtime
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --chown=nextjs:nodejs package.json package-lock.json ./

RUN npm ci --only=production \
    --prefer-offline \
    --no-audit \
    --legacy-peer-deps \
    --no-fund \
    --ignore-scripts

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]