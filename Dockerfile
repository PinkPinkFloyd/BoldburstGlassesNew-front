# ===========================
# 1️⃣ 构建阶段
# ===========================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 Nuxt 4
# 注意：构建阶段不使用任何硬编码 API 地址，运行时才注入
RUN npm run build

# ===========================
# 2️⃣ 运行阶段
# ===========================
FROM node:20-alpine AS runner

WORKDIR /app

# 只安装生产依赖
COPY package*.json ./
RUN npm install --production

# 复制构建产物
COPY --from=builder /app/.output .output

# 设置运行时环境变量会从 docker-compose 的 env_file 或宿主机环境读取
# 如果 docker-compose 已经设置了 env_file，这里不用写死
ENV NODE_ENV=$NODE_ENV
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

# 暴露端口
EXPOSE 3001

# 启动 Nuxt 4
CMD ["node", ".output/server/index.mjs"]
