# Create image for the frontend of the app
FROM node:latest

RUN mkdir -p /app

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 4200

CMD ["npm", "start"]