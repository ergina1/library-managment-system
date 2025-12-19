FROM node:20-alpine

# Create app directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the server code
COPY . .

# Server runs on this port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
