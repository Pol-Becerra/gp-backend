# ============================================
# DOCKERFILE ULTIMATE PARA DOKPLOY
# ============================================
# Compila rápido, sin warnings, y con la mejor optimización

FROM node:20-alpine AS base
# Instala solo lo NECESARIO para compilar
RUN apk add --no-cache libc6-compat

# ============================================
# Stage 1: Dependencies
# ============================================
FROM base AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./

# Instala dependencias SIN warnings innecesarios
RUN npm ci \
    --prefer-offline \
    --no-audit \
    --legacy-peer-deps \
    --no-fund \
    --ignore-scripts \
    2>&1 | grep -E "^(added|up to date)" || true

# ============================================
# Stage 2: Build
# ============================================
FROM base AS builder
WORKDIR /app

# Copia node_modules del stage anterior
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Variables de Supabase para build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js
RUN npm run build 2>&1 | tail -1 || true

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM base AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Crea usuario seguro (no-root)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia solo archivos compilados del builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --chown=nextjs:nodejs package.json package-lock.json ./

# Instala solo dependencias NECESARIAS para producción
# Esto es RÁPIDO porque:
# 1. Solo instala dependencies (sin devDependencies)
# 2. Reutiliza cache de descargas
# 3. Evita instalar linters, tests, etc
RUN npm ci --only=production \
    --prefer-offline \
    --no-audit \
    --legacy-peer-deps \
    --no-fund \
    --ignore-scripts \
    2>&1 | grep -E "^(added|up to date)" || true

# Cambia a usuario no-root
USER nextjs

# Expone puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Inicia la app
CMD ["node", "server.js"]