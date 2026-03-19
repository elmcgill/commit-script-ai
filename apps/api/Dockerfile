FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm install -g ts-node

CMD ["npm", "run", "dev"]
