# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificate (for HTTPS)
- Server with at least 2GB RAM

## Production Deployment Steps

### 1. Server Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2. Clone and Configure

```bash
# Clone repository
git clone <your-repo-url> ai-cv-app
cd ai-cv-app

# Create production environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit configurations
nano backend/.env
nano frontend/.env.local
```

### 3. Update Environment Variables

**backend/.env:**
```
DATABASE_URL=postgresql://user:strong-password@postgres:5432/ai_cv_db
SECRET_KEY=your-very-long-random-secret-key-generate-with-secrets.token_urlsafe(32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DEBUG=False
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 4. Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/ai-cv-app
```

**Nginx Configuration Example:**
```nginx
upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 20M;

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 20M;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
    }
}
```

### 5. Set Up SSL Certificate

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renew certificates
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 6. Enable Nginx Config

```bash
sudo ln -s /etc/nginx/sites-available/ai-cv-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 7. Deploy with Docker Compose

```bash
# Build images
docker-compose -f docker-compose.full.yml build

# Start services in background
docker-compose -f docker-compose.full.yml up -d

# View logs
docker-compose -f docker-compose.full.yml logs -f

# Check status
docker-compose -f docker-compose.full.yml ps
```

### 8. Database Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/ai-cv-app"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U user ai_cv_db | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /home/ubuntu/ai-cv-app/backup.sh
```

### 9. Monitoring and Maintenance

```bash
# View container logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend

# Check disk usage
du -sh /var/lib/docker/volumes/

# Clean up old images and containers
docker system prune -a

# Restart services
docker-compose restart

# Update services
git pull
docker-compose build --no-cache
docker-compose up -d
```

## Performance Optimization

### Backend Optimization

1. **Use Gunicorn for production:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```

2. **Enable caching:**
   - Add Redis for session management
   - Implement database query caching

3. **Database optimization:**
   - Add proper indexes
   - Use connection pooling
   - Regular maintenance (VACUUM, ANALYZE)

### Frontend Optimization

1. **Build optimization:**
   ```bash
   npm run build  # Optimized production build
   ```

2. **Enable compression in Nginx:**
   ```nginx
   gzip on;
   gzip_types text/plain text/css text/javascript application/json;
   gzip_level 6;
   ```

## Monitoring

### Health Checks

- Backend: `https://api.yourdomain.com/health`
- Frontend: `https://yourdomain.com`

### Set up monitoring service (e.g., Uptime Robot)

- Monitor endpoints every 5 minutes
- Get alerts on downtime

## Scaling

For high traffic:

1. **Use load balancer:**
   - AWS ELB, HAProxy, or Nginx upstream

2. **Horizontal scaling:**
   - Run multiple backend instances
   - Use Docker Swarm or Kubernetes

3. **Database scaling:**
   - Read replicas for scaling reads
   - Connection pooling (PgBouncer)

## Security Checklist

- [ ] Changed all default passwords
- [ ] Enabled SSL/TLS (HTTPS)
- [ ] Set SECRET_KEY to a strong random value
- [ ] Enabled firewall (UFW on Linux)
- [ ] Set DEBUG=False in production
- [ ] Set up regular backups
- [ ] Monitor logs regularly
- [ ] Keep Docker images updated
- [ ] Use environment variables for secrets
- [ ] Set up rate limiting
- [ ] Enable CORS only for trusted origins

## Troubleshooting

### Services won't start
```bash
docker-compose logs backend
docker-compose logs postgres
```

### Database connection error
```bash
docker-compose exec postgres psql -U user -d ai_cv_db -c "\dt"
```

### Port already in use
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Nginx configuration error
```bash
sudo nginx -t
sudo systemctl status nginx
```

## Rollback Procedure

```bash
# Stop services
docker-compose down

# Restore database backup
gunzip -c backups/ai-cv-app/backup_<date>.sql.gz | docker-compose exec -T postgres psql -U user ai_cv_db

# Restart services
docker-compose up -d
```
