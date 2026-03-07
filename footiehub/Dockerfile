#Node.js image
FROM node:20-alpine

#set working directory inside container
WORKDIR /app

#copy package files and install dependencies
COPY package*.json ./
RUN npm install

#copy code
COPY . .

# NEXT_PHASE=phase-production-build disables some pre-rendering checks
ENV NEXT_PHASE=phase-production-build
# We tell Next.js that we don't need a DB connection during build
ENV SKIP_ENV_VALIDATION=true

#build app
RUN npm run build

#expose Next.js port
EXPOSE 3000

#start app
CMD ["npm", "start"]