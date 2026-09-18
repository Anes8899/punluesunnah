# Built from the monorepo root: docker build -f apps/admin/Dockerfile .
FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/admin/package.json apps/admin/
RUN npm ci --workspace apps/admin --include-workspace-root=false

FROM deps AS build
COPY apps/admin apps/admin
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w apps/admin

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3001
# standalone output mirrors the monorepo layout under .next/standalone
COPY --from=build /repo/apps/admin/.next/standalone ./
COPY --from=build /repo/apps/admin/.next/static apps/admin/.next/static
COPY --from=build /repo/apps/admin/public apps/admin/public
EXPOSE 3001
CMD ["node", "apps/admin/server.js"]
