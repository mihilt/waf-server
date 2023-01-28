FROM node

EXPOSE 8080

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

CMD npm run docker:start