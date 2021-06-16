FROM node:latest as frontend-build

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app/

EXPOSE 4200

CMD npm run build --prod

FROM nginx:alpine

COPY --from=frontend-build /usr/src/app/dist/frontend /usr/share/nginx/html