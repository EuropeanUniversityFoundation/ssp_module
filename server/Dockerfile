FROM node:alpine
WORKDIR /app

COPY package.json ./

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN apk add --update --no-cache openssl
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN apk update && apk add make g++

RUN npm i

COPY ./ ./


EXPOSE 8443
EXPOSE 8444
EXPOSE 8445

CMD ["npm", "run", "start"]
