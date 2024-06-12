FROM node:18-alpine

RUN apk add --no-cache python3 make g++ 

WORKDIR /app/customer

COPY package.json .

RUN npm install

COPY . .

RUN npm rebuild bcrypt --build-from-source

EXPOSE 3001

CMD ["npm", "start"]
