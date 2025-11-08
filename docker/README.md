# Docker Configuration

This folder contains all Docker-related configuration files for the timetable application.

## Files

### `Dockerfile.dev`
Development Docker image configuration. Includes:
- Node.js 20 Alpine base image
- Chromium and Puppeteer dependencies
- Development environment setup

### `docker-entrypoint-dev.sh`
Entrypoint script that runs on container startup:
- Waits for database to be ready
- Runs `prisma db push`
- Runs `prisma migrate dev`
- Generates Prisma Client
- Starts Next.js development server

### `db-init.sql`
MySQL database initialization script. Runs automatically when the database container starts for the first time:
- Configures user authentication with `caching_sha2_password`
- Grants necessary permissions for Prisma migrations

### `my.cnf`
MySQL configuration file:
- Sets `caching_sha2_password` as default authentication plugin
- Optimizes for Docker environment

### `healthcheck.sh`
Database healthcheck script used by Docker Compose to verify MySQL is ready.

## Usage

All Docker commands should be run from the project root:

```bash
# Start development environment
docker-compose up

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## Notes

- The `docker-compose.yml` file remains in the project root for convenience
- All Docker-related files are organized in this folder for better project structure
- Environment variables are configured in `docker-compose.yml`

