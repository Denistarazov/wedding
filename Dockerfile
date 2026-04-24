FROM node:22-alpine AS app

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run db:generate && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
