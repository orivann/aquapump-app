# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ARG VITE_REACT_APP_API_BASE=/api
ENV VITE_REACT_APP_API_BASE=${VITE_REACT_APP_API_BASE}
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts tailwind.config.ts postcss.config.js components.json ./
COPY index.html ./index.html
COPY public ./public
COPY src ./src
RUN npm run build

# Production stage
FROM nginx:1.27-alpine AS production
RUN apk add --no-cache gettext
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
