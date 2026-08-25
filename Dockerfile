# STAGE 1: Builder
FROM node:18.17.0-alpine3.18 AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install && mkdir -p node_modules
COPY . .

# STAGE 2: Production
FROM node:18.17.0-alpine3.18
WORKDIR /app
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp \
    && chown -R nodeapp:nodeapp /app
USER nodeapp
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/server.js .
COPY --from=builder --chown=nodeapp:nodeapp /app/package.json .
EXPOSE 3000
CMD ["node", "server.js"]
