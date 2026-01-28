FROM node:18-alpine

WORKDIR /app

# 1. 의존성 설치
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 2. 소스 코드 복사 (.dockerignore 덕분에 node_modules는 제외됨)
COPY . .

# 3. NestJS 빌드 (npx 사용으로 실행 권한 우회)
RUN npx nest build

CMD ["node", "dist/main"]