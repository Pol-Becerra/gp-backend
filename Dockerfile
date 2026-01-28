FROM node:20-alpine

WORKDIR /app

# Solo copiar archivos necesarios (ya están compilados)
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

USER nobody

EXPOSE 3000
ENV NODE_ENV production

CMD ["node", "server.js"]