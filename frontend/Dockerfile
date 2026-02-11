# 1. Pega uma imagem base leve do Node (Alpine é uma versão minimalista do Linux)
FROM node:22-alpine

# 2. Define a pasta de trabalho dentro do container
WORKDIR /app

# 3. Copia os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package.json package-lock.json ./

# 4. Instala as dependências dentro do container
RUN npm install

# 5. Copia o resto do código do seu projeto para dentro do container
COPY . .

# 6. Expõe a porta que o React usa (geralmente 3000)
EXPOSE 3000

# 7. O comando para rodar o app
CMD ["npm", "run","dev","--","--host"]