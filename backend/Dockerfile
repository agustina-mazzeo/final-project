FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json ./
# COPY prisma ./prisma/

RUN npm install

COPY . . 

#RUN npx prisma generate

#RUN npm install -g typescript
#RUN npm run prisma:migrate

EXPOSE 3001
CMD [ "npm", "run", "start" ]