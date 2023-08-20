# Use an official Node.js runtime as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Expose the port that http-server uses (default is 8080)
EXPOSE 8080

# Command to start the http-server
CMD ["npm", "start"]
