FROM node:23-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm install

# Copiar código fonte
COPY src ./src
COPY protos ./protos

# Compilar TypeScript
RUN npm run build

# Stage de produção
FROM node:23-alpine

WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção
COPY package*.json ./
RUN npm install --production

# Copiar código compilado e protos do stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/protos ./protos

# Portas
EXPOSE 3000
EXPOSE 50051

# Ambientes
ENV NODE_ENV=production
ENV GRPC_PORT=50051

# Usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"