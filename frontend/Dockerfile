# Escolha a imagem base
FROM node:18-bullseye

# Crie o diretório de trabalho
WORKDIR /app

RUN npm cache clean --force


# Copie os arquivos de configuração
COPY package*.json ./

# Dockerfile
RUN rm -rf node_modules package-lock.json


# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta que o Vite usa
EXPOSE 5173

# Comando para iniciar o Vite
CMD ["npm", "run", "dev"]
