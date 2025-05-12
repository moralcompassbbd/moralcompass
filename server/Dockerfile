FROM node:20

WORKDIR /app

COPY common/package*.json common/tsconfig.json ./common/
COPY client/package*.json client/tsconfig.json ./client/
COPY server/package*.json server/tsconfig.json ./server/

COPY common ./common
COPY client ./client
COPY server ./server

WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app/server
RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]