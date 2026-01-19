# ===== 构建阶段 =====
FROM node:20-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 使用生产环境变量构建
ENV NUXT_PUBLIC_API_BASE_URL=https://api.boldburstglasses.com

RUN npx nuxi build

# ===== 运行阶段 =====
FROM node:20-bullseye

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY package*.json ./

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
