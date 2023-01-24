FROM node:16
WORKDIR /usr/src/blog-api
COPY ./package.json .
RUN npm install --only=prod