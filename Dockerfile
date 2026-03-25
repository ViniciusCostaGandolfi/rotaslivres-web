# Estágio 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration=production

FROM node:22-alpine AS runner
WORKDIR /app


COPY --from=build /app/dist/rotaslivres-web /app/dist/rotaslivres-web
COPY --from=build /app/package.json /app/package.json


CMD ["node", "dist/rotaslivres-web/server/server.mjs"]

EXPOSE 4000
ENV NODE_ENV=production