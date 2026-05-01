# ============================================================
# Stage 1 — deps: instala dependências de produção e dev
# ============================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Instala pnpm globalmente (o projeto usa pnpm-lock.yaml)
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Instala dependências respeitando o lockfile quando possível
RUN pnpm install --no-frozen-lockfile

# ============================================================
# Stage 2 — builder: compila o Next.js
# ============================================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

# Copia node_modules já instaladas do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia todo o código-fonte
COPY . .

# NEXT_PUBLIC_API_URL é baked no bundle JS em build-time.
# Valor padrão: localhost:8080 (browser acessa pelo host).
# Sobrescreva no docker-compose com: build.args.NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# ============================================================
# Stage 3 — runner: imagem final mínima (standalone)
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copia apenas o necessário gerado pelo output: 'standalone'
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

USER nextjs

EXPOSE 3000

# server.js é gerado pelo standalone — inicia o Next.js diretamente com Node
CMD ["node", "server.js"]

