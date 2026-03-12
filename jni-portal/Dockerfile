# Base image
FROM node:lts-alpine 

# To copy the .env.{ENV_VAR} (depending on the git branch)
# in this image.
ARG ENV_VAR=dev

# Set working directory
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./


# Install dependencies
RUN yarn install


# Copy project files
COPY . .

COPY .env.$ENV_VAR /app/.env

# Start dev server
# PABO ! A changer ou à passer dans les command
# du k8s deployment.
CMD ["yarn", "dev", "--host", "0.0.0.0"]
