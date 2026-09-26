FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY dist ./dist
COPY server ./server
COPY scripts ./scripts
RUN npm run build

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0 DATABASE_PATH=/data/rooms.sqlite
COPY --from=build /app/dist/server ./dist/server
COPY package.json ./
COPY scripts/serve.mjs scripts/local-db.mjs ./scripts/
COPY drizzle ./drizzle
RUN mkdir -p /data
EXPOSE 8080
CMD ["node", "scripts/serve.mjs"]
