# Use Bun official image as the base
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (assuming 3000)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
