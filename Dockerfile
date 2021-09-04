FROM node:16.8.0-alpine3.13 as builder

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:16.8.0-alpine3.13

WORKDIR /app

COPY --from=builder /app/dist /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules

CMD [ "node", "app.js" ]
