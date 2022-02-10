FROM nginx:latest
ENV TZ=Asia/Shanghai
COPY ./build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
