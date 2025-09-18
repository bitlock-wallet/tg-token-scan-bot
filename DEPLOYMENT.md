# Docker Deployment Guide

This guide explains how to deploy the Telegram Token Scan Bot using Docker and Docker Compose.

## Quick Start

### 1. Prerequisites

- Docker installed on your system
- Docker Compose v2.0 or higher
- Telegram Bot Token from [@BotFather](https://t.me/botfather)

### 2. Environment Setup

1. Copy the environment template:

   ```bash
   cp env.production .env
   ```

2. Edit `.env` file with your configuration:

   ```bash
   nano .env
   ```

   **Required variables:**

   - `TELEGRAM_BOT_TOKEN`: Get this from @BotFather on Telegram

   **Optional but recommended:**

   - `HELIUS_API_KEY`: For better Solana performance
   - `ETHEREUM_RPC_URL`: Replace with your Alchemy/Infura key
   - Other API keys for enhanced performance

### 3. Deploy

#### Development/Testing

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f tg-token-bot

# Stop
docker-compose down
```

#### Production

```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f tg-token-bot
```

## Configuration Files

### docker-compose.yml

- Basic deployment setup
- Suitable for development and simple production deployments
- Includes health checks and resource limits

### docker-compose.prod.yml

- Production-ready configuration
- Includes additional services:
  - **Watchtower**: Automatic container updates
  - **Logrotate**: Log management
- Enhanced resource limits and logging

### Dockerfile

- Multi-stage build for optimization
- Uses Node.js 18 Alpine for smaller image size
- Non-root user for security
- Health checks included

## Environment Variables

| Variable              | Required | Default                     | Description                   |
| --------------------- | -------- | --------------------------- | ----------------------------- |
| `TELEGRAM_BOT_TOKEN`  | ✅       | -                           | Bot token from @BotFather     |
| `SOLANA_RPC_URL`      | ❌       | Public RPC                  | Solana network RPC endpoint   |
| `ETHEREUM_RPC_URL`    | ❌       | Public RPC                  | Ethereum network RPC endpoint |
| `BSC_RPC_URL`         | ❌       | Public RPC                  | BSC network RPC endpoint      |
| `HELIUS_API_KEY`      | ❌       | -                           | Enhanced Solana data access   |
| `DEXSCREENER_API_URL` | ❌       | https://api.dexscreener.com | DexScreener API               |
| `HONEYPOT_API_URL`    | ❌       | https://api.honeypot.is     | Honeypot detection API        |
| `NODE_ENV`            | ❌       | production                  | Node.js environment           |

## Management Commands

### Viewing Logs

```bash
# Real-time logs
docker-compose logs -f tg-token-bot

# Last 100 lines
docker-compose logs --tail=100 tg-token-bot

# Logs since timestamp
docker-compose logs --since="2024-01-01T00:00:00" tg-token-bot
```

### Updating the Bot

```bash
# Pull latest code and rebuild
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Or with production config
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Health Checks

```bash
# Check container status
docker-compose ps

# Check health
docker inspect tg-token-scan-bot | grep -A 10 Health
```

### Resource Monitoring

```bash
# Container stats
docker stats tg-token-scan-bot

# Detailed resource usage
docker-compose top
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Network Security**: The bot runs in an isolated Docker network
3. **User Permissions**: Container runs as non-root user
4. **Resource Limits**: Memory and CPU limits prevent resource exhaustion
5. **Health Checks**: Automatic restart on failures

## Troubleshooting

### Common Issues

1. **Bot not responding**

   ```bash
   # Check logs
   docker-compose logs tg-token-bot

   # Restart service
   docker-compose restart tg-token-bot
   ```

2. **Build failures**

   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose build --no-cache
   ```

3. **Permission errors**

   ```bash
   # Check file permissions
   ls -la .env

   # Fix if needed
   chmod 600 .env
   ```

4. **Network connectivity issues**
   ```bash
   # Test from container
   docker exec tg-token-scan-bot curl -I https://api.telegram.org
   ```

### Log Analysis

```bash
# Filter for errors
docker-compose logs tg-token-bot | grep -i error

# Filter for specific token scans
docker-compose logs tg-token-bot | grep "scanning token"

# Check bot startup
docker-compose logs tg-token-bot | head -20
```

## Backup and Restore

### Backup Configuration

```bash
# Backup environment and compose files
tar -czf bot-backup-$(date +%Y%m%d).tar.gz .env docker-compose*.yml
```

### Backup Logs (if using persistent volumes)

```bash
# Export logs volume
docker run --rm -v tg-token-scan-bot_bot_logs:/data -v $(pwd):/backup alpine tar czf /backup/logs-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## Performance Optimization

1. **Use Private RPCs**: Replace public RPC endpoints with private ones for better performance
2. **API Keys**: Add all optional API keys for enhanced data access
3. **Resource Limits**: Adjust memory/CPU limits based on usage patterns
4. **Log Rotation**: Use production config with log management

## Production Deployment

For production environments:

1. Use `docker-compose.prod.yml`
2. Set up proper monitoring (consider adding Prometheus/Grafana)
3. Configure log aggregation
4. Set up backup schedules
5. Use private RPC endpoints
6. Configure firewall rules
7. Enable SSL/TLS if exposing any web interfaces

## Support

For issues or questions:

1. Check the logs first
2. Verify environment configuration
3. Test network connectivity
4. Review the main README.md for bot-specific documentation
