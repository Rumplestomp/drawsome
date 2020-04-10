FROM node:13.10.1

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY *.js ./

EXPOSE 3000
CMD [ "npm", "run", "prod" ]
