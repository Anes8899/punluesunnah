# Built from the monorepo root: docker build -f services/quran-service/Dockerfile .
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY services/quran-service/package.json services/quran-service/
RUN npm ci --workspace services/quran-service --include-workspace-root=false
COPY packages/shared-types packages/shared-types
COPY services/quran-service services/quran-service
RUN npm run build -w services/quran-service

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules node_modules
COPY --from=build /repo/services/quran-service/package.json services/quran-service/
COPY --from=build /repo/services/quran-service/dist services/quran-service/dist
WORKDIR /repo/services/quran-service
EXPOSE 4002
CMD ["node", "dist/server.js"]
