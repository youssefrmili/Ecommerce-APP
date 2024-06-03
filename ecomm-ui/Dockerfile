FROM nginx:stable-alpine

ARG WORKING_DIRECTORY=/app

COPY ${WORKING_DIRECTORY}/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]