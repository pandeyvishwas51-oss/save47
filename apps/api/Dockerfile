FROM node:20-alpine AS base
RUN apk add --no-cache python3 py3-pip ffmpeg curl ca-certificates

# Install yt-dlp (latest release binary)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

RUN npm install -g pnpm@9

# Copy workspace metadata so pnpm understands the structure.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Install only the API's dependencies. Use --no-frozen-lockfile as a fallback
# in case the lockfile was generated with newer/different optional deps.
RUN pnpm install --filter @save47/api... --frozen-lockfile=false

COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
