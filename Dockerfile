# Stage 1: Build the Vue app
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve the app using an Nginx server
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set a build argument for the source directory (default to 'dist')
ARG BUILD_DIR=dist

# Copy the build output dynamically based on the build argument
COPY --from=build /app/${BUILD_DIR} /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
