# Usa a imagem oficial do Node.js
FROM node:20

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Copia a pasta do Prisma antes para gerar o cliente
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o Prisma Client compatível com o Linux do container
RUN npx prisma generate

# Copia o restante do código da API
COPY . .

# Libera a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor em modo de desenvolvimento
CMD sh -c "npx prisma migrate deploy && npm run dev"