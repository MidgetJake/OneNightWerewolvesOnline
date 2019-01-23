FROM node:10
ADD package.json /tmp/package.json
RUN cd /tmp && npm i && npm i -g webpack webpack-cli
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src

RUN webpack

EXPOSE 8085
CMD ["node", "/src/server.js"]