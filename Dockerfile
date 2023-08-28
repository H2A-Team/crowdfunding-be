FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 5001
CMD ["npm", "start"]