# ---------- Dependencies ----------
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# ---------- Builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- Production ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev


# Install Doppler CLI
RUN wget -q -t3 \
'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' \
-O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub \
 && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' \
 >> /etc/apk/repositories \
 && apk add --no-cache doppler


COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["doppler","run","--","node", "dist/server.js"]