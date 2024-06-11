FROM amazoncorretto:17-alpine-jdk

RUN apk update && \
    apk upgrade && \
    apk add --no-cache busybox openssl=3.1.5-r0

WORKDIR /app

ARG JAR_FILE=target/ecomm-cart-1.0.jar
ADD ${JAR_FILE} .

ENTRYPOINT ["java","-jar","ecomm-cart-1.0.jar"]
