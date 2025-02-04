# 使用 Node.js 作为基础镜像
FROM node:20


# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 启用 Corepack
RUN corepack enable

# 安装依赖
RUN yarn install

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 8080

# 启动 VuePress
CMD ["yarn", "dev"]