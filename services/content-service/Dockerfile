# Built from the monorepo root: docker build -f services/content-service/Dockerfile .
FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY services/content-service/package.json services/content-service/
RUN npm ci --workspace services/content-service --include-workspace-root=false

FROM deps AS build
COPY packages/shared-types packages/shared-types
COPY services/content-service services/content-service
RUN npm run build -w services/content-service

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules node_modules
COPY --from=build /repo/packages/shared-types packages/shared-types
COPY --from=build /repo/services/content-service/package.json services/content-service/
COPY --from=build /repo/services/content-service/dist services/content-service/dist
COPY --from=build /repo/services/content-service/drizzle services/content-service/drizzle
COPY --from=build /repo/services/content-service/seed services/content-service/seed
COPY --from=build /repo/services/content-service/src services/content-service/src
COPY --from=build /repo/services/content-service/tsconfig.json services/content-service/
WORKDIR /repo/services/content-service
EXPOSE 4001
CMD ["node", "dist/server.js"]
