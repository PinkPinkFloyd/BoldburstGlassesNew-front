FROM node:20-alpine

WORKDIR /app

# 只装生产依赖
COPY package*.json ./
RUN npm install --production

# 拷贝构建产物
COPY .output .output

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
