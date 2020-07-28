FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
EXPOSE 8080
CMD ["node", "start"]