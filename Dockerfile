FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY ./package.json ./yarn.lock ./
RUN apk add --no-cache iputils bash git tini && \
  yarn install --frozen-lockfile && \
  apk del bash git && \
  yarn cache clean

COPY . .
RUN yarn run lint && yarn run build

USER node
ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000
CMD ["yarn", "run", "start"]
