# syntax=docker/dockerfile:1.2
FROM node:14-alpine AS deps
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile && \
  yarn cache clean

# ---
FROM node:14-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# ---
FROM node:14-alpine AS runner

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN apk add --no-cache iputils tini

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["yarn", "run", "start"]
