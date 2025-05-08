FROM node:20

WORKDIR /app

COPY common ./common
COPY client ./client
COPY server ./server

WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app/server
RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]