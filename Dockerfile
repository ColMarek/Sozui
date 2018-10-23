FROM node:carbon

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY . .

CMD [ "npm", "start" ]