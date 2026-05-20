# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
ARG GEOAPIFY_API_KEY=""
ARG EMOJI_API_KEY=""
ENV GEOAPIFY_API_KEY=$GEOAPIFY_API_KEY
ENV EMOJI_API_KEY=$EMOJI_API_KEY
COPY package*.json ./
RUN npm ci
COPY . .
RUN node -e "const fs=require('fs');const p='src/environments/environment.ts';let c=fs.readFileSync(p,'utf8');c=c.replace('__GEOAPIFY_API_KEY__',process.env.GEOAPIFY_API_KEY||'');c=c.replace('__EMOJI_API_KEY__',process.env.EMOJI_API_KEY||'');fs.writeFileSync(p,c);" && npm run build

# ---- runtime ----
FROM nginx:alpine
COPY --from=build /app/dist/angular-chat-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
