# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json .npmrc ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc,required=true \
    --mount=type=secret,id=forgejo_token,env=FORGEJO_TOKEN \
    npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
