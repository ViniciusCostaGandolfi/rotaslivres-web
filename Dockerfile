# Estágio 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY patch-ngx-datatable.js ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

FROM node:22-alpine AS runner
WORKDIR /app


COPY --from=build /app/dist/gradehorarios-web /app/dist/gradehorarios-web
COPY --from=build /app/package.json /app/package.json

# O segredo está aqui: 
# 1. O arquivo agora é .mjs (ES Module)
# 2. O nome padrão é server.mjs
CMD ["node", "dist/gradehorarios-web/server/server.mjs"]

# Porta padrão do SSR é 4000
EXPOSE 4000
ENV NODE_ENV=production