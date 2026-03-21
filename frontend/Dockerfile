# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# ===== Build-time ENV =====
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CLIENT_URL
ARG NEXT_PUBLIC_ADMIN_URL
ARG NEXT_PUBLIC_FILE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_TURNSTILE_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLIENT_URL=$NEXT_PUBLIC_CLIENT_URL
ENV NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL
ENV NEXT_PUBLIC_FILE_URL=$NEXT_PUBLIC_FILE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_TURNSTILE_KEY=$NEXT_PUBLIC_TURNSTILE_KEY

# Build
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]