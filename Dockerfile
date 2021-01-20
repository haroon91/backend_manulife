FROM node:13

ENV PORT 8082

WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run tsc
EXPOSE ${PORT}

CMD ["node", "./www/server.js"]