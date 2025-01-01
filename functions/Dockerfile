FROM node:22-slim

WORKDIR /functions
COPY . .

RUN npm install

CMD [ "npm", "run", "build" ]
