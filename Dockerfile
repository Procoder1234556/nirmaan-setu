FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
RUN pnpm prisma generate && pnpm build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=10000
COPY --from=build /app ./
EXPOSE 10000
CMD ["sh", "-c", "pnpm prisma db push --skip-generate && exec pnpm start -p ${PORT}"]
