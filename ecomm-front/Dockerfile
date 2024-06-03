# Build stage
FROM node:20.9.0-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Set environment variable
ENV PUBLIC_URL=/

# Build the app
RUN npm run build

# Nginx stage
FROM nginx:stable-alpine

# Copy the build output to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration if necessary
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
