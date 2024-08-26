FROM node:22 as builder

WORKDIR /website

COPY . .

RUN npm i

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /website/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]