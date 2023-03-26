# Build stage
FROM node:18-alpine3.16 AS build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install development dependencies
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    g++ \
    python3 \
    && yarn install --frozen-lockfile --production=false \
    && apk del .build-deps \
    && yarn cache clean

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN yarn build

# Run stage
FROM node:18-alpine3.16 AS run

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dumb-init
RUN apk add --no-cache dumb-init

# Add a non-root user to run the application
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001 \
    && chown -R nodejs:nodejs /app

# Switch to the non-root user
USER nodejs

# Install production dependencies
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# Copy the built application code from the build stage
COPY --chown=nodejs:nodejs --from=build /app/dist ./dist

# Copy the prisma directory from the build stage
COPY --chown=nodejs:nodejs --from=build /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

# Generate prisma client
RUN yarn prisma generate

# Expose port for the application to listen on
EXPOSE 4040

# Start the application with dumb-init
CMD ["dumb-init", "node", "dist/index.js"]
