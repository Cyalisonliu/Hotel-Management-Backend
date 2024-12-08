# Development stage
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Test stage
FROM node:18 AS test

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "test"]

# Build stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18 AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]
