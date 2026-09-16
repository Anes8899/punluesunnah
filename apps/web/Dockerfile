# Built from the monorepo root: docker build -f apps/web/Dockerfile .
FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/api-client/package.json packages/api-client/
COPY apps/web/package.json apps/web/
RUN npm ci --workspace apps/web --include-workspace-root=false

FROM deps AS build
COPY packages/shared-types packages/shared-types
COPY packages/api-client packages/api-client
COPY apps/web apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w apps/web

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# standalone output mirrors the monorepo layout under .next/standalone
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static apps/web/.next/static
COPY --from=build /repo/apps/web/public apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
