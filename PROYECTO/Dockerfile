FROM node:20.10.0

WORKDIR /usr/src/app

COPY . .
RUN npm ci --production

USER 1000
EXPOSE 3000
CMD ["node", "src/index.js"]
