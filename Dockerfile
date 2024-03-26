# This is Dockerfile, which has all the information about about creating
# and hosting our fragments service inside a container.
# The link to the documentation - https://docs.docker.com/engine/reference/builder/

# Stage 0: Install base Dependencies
# Use node version 20.11.0
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 as dependencies

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY --chown=node:node package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci

# Stage 1: Deploy the app
FROM nginx:1.25.4@sha256:6db391d1c0cfb30588ba0bf72ea999404f2764febf0f1f196acd5867ac7efa7e

LABEL maintainer="Steven David Pillay <stevendavidpillay@gmail.com>" \
      description="Fragments node.js microservice"

COPY ./index.html /usr/share/nginx/html/index.html
