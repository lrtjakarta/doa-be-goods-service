FROM node:18
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production

EXPOSE 2050
CMD ["npm", "start"]
