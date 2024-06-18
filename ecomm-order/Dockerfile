FROM amazoncorretto:17-alpine-jdk

RUN apk update && \
    apk upgrade && \
    apk add --no-cache busybox=1.36.1-r19 openssl=3.1.5-r0

WORKDIR /app

ARG JAR_FILE=target/ecomm-order-1.0.jar
ADD ${JAR_FILE} .

ENTRYPOINT ["java","-jar","ecomm-order-1.0.jar"]
