FROM node:14-alpine

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . ./

RUN tsc -b

ENV JWT_ACCESS_TOKEN ""
ENV DEBUG "false"
ENV MONGO_URI ""
ENV SESSION_SECRET ""
ENV PORT "8080"
ENV OSTICKET_URL ""
ENV OSTICKET_API_KEY ""
ENV SWISH_PAYEE_NUMBER ""
ENV PAYPAL_CLIENT_ID ""
ENV PAYPAL_CLIENT_SECRET ""
ENV DOMAIN ""
ENV HTTP_SCHEMA ""
ENV STRIPE_SK_LIVE ""
ENV STRIPE_SK_PUBLIC ""
ENV STRIPE_WEBHOOK_SECRET ""

EXPOSE 8080

CMD [ "node", "./build/Main.js" ]