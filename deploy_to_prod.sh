#!/bin/bash

TARGET_DIR="prod_manifests"

if [ -d "$TARGET_DIR" ]; then
  rm -rf "$TARGET_DIR"
fi

mkdir -p $TARGET_DIR/infrastructure
mkdir -p $TARGET_DIR/microservices

curl -o $TARGET_DIR/infrastructure/configmap.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/infrastructure/configmap.yml
curl -o $TARGET_DIR/infrastructure/elasticsearch-volumes.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/infrastructure/elasticsearch-volumes.yml
curl -o $TARGET_DIR/infrastructure/elasticsearch.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/infrastructure/elasticsearch.yml
curl -o $TARGET_DIR/infrastructure/postgres-volumes.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/infrastructure/postgres-volumes.yml
curl -o $TARGET_DIR/infrastructure/postgres.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/infrastructure/postgres.yml

curl -o $TARGET_DIR/microservices/ecomm-cart.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/microservices/ecomm-cart.yml
curl -o $TARGET_DIR/microservices/ecomm-order.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/microservices/ecomm-order.yml
curl -o $TARGET_DIR/microservices/ecomm-product.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/microservices/ecomm-product.yml
curl -o $TARGET_DIR/microservices/ecomm-ui.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/microservices/ecomm-ui.yml
curl -o $TARGET_DIR/microservices/ecomm-web.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/microservices/ecomm-web.yml

curl -o $TARGET_DIR/namespace.yml https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/prod_manifests/namespace.yml
