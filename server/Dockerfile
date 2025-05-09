FROM node:20

WORKDIR /app

COPY common/package*.json ./common/
COPY client/package*.json ./client/
COPY server/package*.json ./server/


COPY common ./common
COPY client ./client
COPY server ./server

WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app/server
RUN npm install && npm run build

RUN mkdir -p dist/client && \
    cp -r ../client/dist ./dist/client && \
    cp -r ../client/static ./dist/client

EXPOSE 3000

CMD ["npm", "run", "start"]