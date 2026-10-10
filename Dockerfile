# Use the official Bun runtime as the base image
FROM oven/bun:1.4.3

# Set the working directory inside the container
WORKDIR /app

# Copy the package manifest and server entry point
COPY package.json server.js ./

# Install app dependencies
RUN bun install

# Expose the port that the static server uses (default is 8080)
EXPOSE 8080

# Command to start the Bun static server
CMD ["bun", "start"]
