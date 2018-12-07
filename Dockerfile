FROM node:10.13.0-alpine as base

# Create working dir
RUN mkdir -p /home/app
WORKDIR /home/app

# Install runtime deps
RUN apk add --no-cache libc6-compat

# ----------------------------------------------------------------------------------------------------------------------

FROM base as installer

RUN apk add --no-cache build-base python

# Add source files
ADD package.json package-lock.json /home/app/

# Install npm deps
RUN npm install --production --unsafe-perm --quiet

# ----------------------------------------------------------------------------------------------------------------------

FROM installer as builder

RUN apk add --no-cache git openssh

# Add install files
#ADD scripts/build.js /home/app/scripts/

# Install deps
ENV GIT_DIR /home/app
RUN npm install --unsafe-perm --quiet

# Add source files
ADD views/src /home/app/views/src

# Build app
RUN npm run build

# ----------------------------------------------------------------------------------------------------------------------

FROM base

ENV mineralcatalog_config_verbose false
ENV mineralcatalog_config_build true

# Add source files
ADD . /home/app/

# Copy npm deps and build artifacts
COPY --from=installer /home/app/node_modules /home/app/node_modules
COPY --from=builder /home/app/build /home/app/build

# Cleanup
RUN rm -rf .bowerrc \
           package-lock.json \
           views/src

CMD npm --loglevel=silent start

EXPOSE 80
