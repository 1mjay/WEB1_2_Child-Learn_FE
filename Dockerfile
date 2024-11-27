# Stage 1: Build
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# TypeScript 설정을 임시로 생성
RUN echo '{ "extends": "./tsconfig.json", "compilerOptions": { "noUnusedLocals": false, "noUnusedParameters": false, "allowUnusedLabels": true, "noImplicitAny": false } }' > tsconfig.prod.json

# 임시 TypeScript 설정으로 빌드
RUN npx tsc -p tsconfig.prod.json --noEmit && npm run build

# Stage 2: Production
FROM nginx:alpine
# build 단계에서 생성된 결과물만 복사
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_IP}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]