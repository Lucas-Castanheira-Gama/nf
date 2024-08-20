FROM node:18-bullseye-slim

# Instale Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o diretório prisma para o container
COPY prisma ./prisma

# Copie o restante do código
COPY . .

# Gere o Prisma Client
RUN npm run build

# Exponha a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
