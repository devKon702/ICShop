#!/bin/sh

echo "🚀 Running Prisma migrate..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running seed..."
  node dist/prisma/seed.js
fi

echo "🔥 Starting app..."
node dist/src/server.js