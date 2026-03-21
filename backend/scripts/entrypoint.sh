#!/bin/sh

echo "🚀 Running Prisma migrate..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running seed..."
  npx prisma db seed
fi

echo "🔥 Starting app..."
node dist/main.js