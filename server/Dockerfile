FROM node:20-slim

# Instalar LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]