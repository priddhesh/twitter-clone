FROM node

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY app.js app.js

ENTRYPOINT ["node","app.js"]


