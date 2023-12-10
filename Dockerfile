FROM node:18-alpine

RUN apk add --update curl

RUN apk add --update curl tzdata && \
    cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

COPY .env-local ./.env

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start:prod" ]