FROM mhart/alpine-node:6.9.2

RUN npm install -g yarn

WORKDIR /src
ADD . .

EXPOSE 3000

RUN yarn install

ENTRYPOINT npm start
