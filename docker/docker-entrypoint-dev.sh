#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running Prisma db push..."
npx prisma db push --accept-data-loss || true

echo "Running Prisma migrate dev (generate and apply migrations)..."
npx prisma migrate dev --name init || true

echo "Generating Prisma Client..."
npx prisma generate

echo "Starting Next.js development server..."
exec "$@"

