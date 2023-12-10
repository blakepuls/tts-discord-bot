# Base stage
FROM node:18 AS base

WORKDIR /app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

COPY package.json yarn.lock ./
COPY audio ./audio
COPY config ./config
COPY packages/lib/package.json packages/lib/
COPY packages/discord/package.json packages/discord/
COPY packages/web/package.json packages/web/

RUN yarn install --frozen-lockfile --ignore-scripts

# Build stage
FROM base AS build

COPY packages packages

# Insert build steps for each package, e.g., TypeScript compilation, etc.
RUN yarn --cwd packages/discord build
RUN yarn --cwd packages/lib build
RUN yarn --cwd packages/web build

# Package-specific build stages
FROM build AS discord-build
COPY --from=build /app/packages/discord packages/discord
COPY --from=build /app/packages/lib packages/lib

FROM build AS web-build
COPY --from=build /app/packages/web packages/web

# Runtime stage for web
FROM node:18 AS web

WORKDIR /app

COPY --from=web-build /app ./

CMD ["yarn", "--cwd", "packages/web", "start"]

# Runtime stage for discord
FROM node:18 AS discord

WORKDIR /app

COPY --from=discord-build /app ./

CMD ["yarn", "--cwd", "packages/discord", "start"]