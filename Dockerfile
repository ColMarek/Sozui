FROM node:14.0.0-alpine3.10

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY . .

CMD [ "npm", "start" ]