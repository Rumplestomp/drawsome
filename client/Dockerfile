FROM node:13.10.1

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY src ./src
COPY config ./config
COPY index.html ./
COPY build ./build
COPY .eslintrc.js ./
COPY .eslintignore ./
COPY .postcssrc.js ./

EXPOSE 8080

CMD ["npm", "run", "dev"]