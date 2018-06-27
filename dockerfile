#from mhart/alpine-node:8.9.4
from node:8.9.4-alpine

COPY . /opt/bcos-server

WORKDIR /opt/bcos-server

RUN apk update && apk add --update --no-cache --virtual .build-deps \
        binutils-gold \
        curl \
        g++ \
        gcc \
        gnupg \
        libgcc \
        linux-headers \
        make \
        git \
        python && \
		npm install && \
		apk del .build-deps
EXPOSE 2443
CMD [ "/bin/sh","-c","node src/backend/bin/start_cluster.js" ]