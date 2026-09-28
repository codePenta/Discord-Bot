# discord-bot

A Discord bot built with Bun and discord.js, containerized with Docker.

## Prerequisites

- Docker & Docker Compose
- Bun (for local development)
- Discord Bot Token & Application ID

## Quick Start

### With Docker Compose

1. Create a `.env` file:
```env
DISCORD_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here
```

2. Start the bot:
```bash
docker compose up
```

The bot will start and automatically healthchecks every 30 seconds. View health status with:
```bash
docker ps
```

### Local Development

1. Install dependencies:
```bash
bun install
```

2. Create a `.env` file with your Discord credentials

3. Run:
```bash
bun run bot.ts
```

## Architecture

- **bot.ts** — Entry point, orchestrates client setup and command handling
- **src/client.ts** — Creates and configures the Discord client with health monitoring
- **src/services/HealthMonitor.ts** — Tracks bot health status for container monitoring
- **src/services/GracefulShutdown.ts** — Handles graceful shutdown on SIGTERM
- **src/services/CommandRegistry.ts** — Manages command registration and dispatch
- **src/commands/** — Individual command implementations

## Health Monitoring

The bot writes its health status to `/tmp/bot-health` every 30 seconds. Docker's healthcheck script validates:
- Status is `healthy`
- Timestamp is not older than 90 seconds

View container health:
```bash
docker ps  # Shows (healthy) or (unhealthy)
docker inspect <container-id> | grep -A 10 Health
```

## CI/CD Pipeline

GitHub Actions automatically:
- **Lint** TypeScript code on every push and PR
- **Build** Docker image to catch build failures
- **Push** image to Docker Hub on merges to `main`

### Setup Docker Hub Push

Add secrets to your GitHub repo (Settings > Secrets):
- `DOCKER_USERNAME` — Docker Hub username
- `DOCKER_PAT` — Docker Hub Personal Access Token (from hub.docker.com/settings/security)

## Docker

### Build

```bash
docker build -t discord-bot .
```

### Run

```bash
docker run --env-file .env discord-bot
```

### Optimize

Multi-stage build reduces final image size by keeping only production dependencies.
