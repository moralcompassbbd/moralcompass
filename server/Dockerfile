FROM node:20

WORKDIR /app

COPY common ./common
COPY client ./client
COPY server ./server

WORKDIR /app/server

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]