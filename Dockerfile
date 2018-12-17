#FROM hooop/imagemagick-ffmpeg-node
#FROM node:11.4-alpine
#FROM python:2.7-alpine

#FROM node:alpine
FROM ubuntu:18.04


ENV AUTHOR=computerscare

RUN apt-get update
RUN apt-get install -y nodejs npm
RUN apt-get install -y ffmpeg

#RUN apt-get install -y python2.7

RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev


WORKDIR /var/candraw/

COPY . /var/candraw/
RUN ls

RUN rm -rf node_modules/
RUN rm package-lock.json
#RUN python --version
#RUN npm install -g node-gyp
RUN npm install
# RUN apk add --no-cache --virtual .gyp \
#         python \
#         make \
#         g++ \
#     && npm install \
#         #[ your npm dependencies here ] \
#     && apk del .gyp


CMD node index.js serve
