# BUILD
FROM node:latest as frontend-build

RUN mkdir /usr/src/app

# temporary fix while packge @angular-devkit/build-angular is being fixed
RUN mkdir -p /usr/src/app/dist/frontend 

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY package.json /usr/src/app/
RUN npm install --legacy-peer-deps

COPY . /usr/src/app/

RUN ng build

# prod server
FROM nginx:alpine

COPY --from=frontend-build /usr/src/app/dist/frontend/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]