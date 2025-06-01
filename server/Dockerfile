FROM node:20.16.0
WORKDIR /app
COPY package*.json ./
RUN npm install
# ENV NODE_ENV production
EXPOSE 5000
CMD ["node", "index.js"]