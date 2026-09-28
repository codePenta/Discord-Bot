FROM oven/bun:1-alpine AS install
WORKDIR /temp/prod

COPY package.json bun.lock .
RUN bun install
RUN bun install --frozen-lockfile --production


FROM oven/bun:1-alpine AS release
WORKDIR /usr/src/app

COPY --from=install /temp/prod/node_modules ./node_modules
COPY bot.ts tsconfig.json .
COPY healthcheck.sh /healthcheck.sh

RUN chmod +x /healthcheck.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /healthcheck.sh

USER bun

ENTRYPOINT ["bun", "run", "bot.ts"]
