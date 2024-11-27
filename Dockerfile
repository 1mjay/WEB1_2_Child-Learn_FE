# Stage 1: Build
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# package.json의 build 스크립트를 임시로 수정
RUN npm pkg set scripts.build="vite build"

# 빌드 실행
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
# build 단계에서 생성된 결과물만 복사
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_IP}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]