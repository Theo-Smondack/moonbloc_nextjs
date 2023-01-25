FROM node:18.13-alpine

WORKDIR /usr/src/dockerApps

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev