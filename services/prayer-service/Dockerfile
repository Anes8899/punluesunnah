# Built from the monorepo root: docker build -f services/prayer-service/Dockerfile .
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY services/prayer-service/package.json services/prayer-service/
RUN npm ci --workspace services/prayer-service --include-workspace-root=false
COPY packages/shared-types packages/shared-types
COPY services/prayer-service services/prayer-service
RUN npm run build -w services/prayer-service

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules node_modules
COPY --from=build /repo/services/prayer-service/package.json services/prayer-service/
COPY --from=build /repo/services/prayer-service/dist services/prayer-service/dist
WORKDIR /repo/services/prayer-service
EXPOSE 4003
CMD ["node", "dist/server.js"]
