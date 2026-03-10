#Node.js image
FROM node:20-alpine

#set working directory inside container
WORKDIR /app

#copy package files and install dependencies
COPY package*.json ./
RUN npm install

#copy code
COPY . .

#build app
RUN npm run build

#expose Next.js port
EXPOSE 3000

#start app
CMD ["npm", "start"]