FROM node:13.10.1

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY src ./
COPY config ./
COPY index.html ./
COPY build ./

EXPOSE 8080

CMD ["npm", "run", "dev"]