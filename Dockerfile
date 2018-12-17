FROM ubuntu:18.04

ENV AUTHOR=computerscare

RUN apt-get update
RUN apt-get install -y nodejs npm
RUN apt-get install -y ffmpeg
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev


WORKDIR /var/candraw/
COPY . /var/candraw/

RUN rm -rf node_modules/
RUN rm package-lock.json
RUN npm install

# this is the final command run
CMD node index.js serve
