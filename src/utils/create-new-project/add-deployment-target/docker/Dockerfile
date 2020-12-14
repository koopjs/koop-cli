# Based on the latest Node.js LTS version
FROM node:lts

# Create app directory in docker
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm ci --only=production

# Copy app source code
COPY . .

# Expose the server port. This must be the same as the one in the config (config/default.json)
EXPOSE 8080

# Start the Koop app
CMD [ "node", "src/index.js" ]
